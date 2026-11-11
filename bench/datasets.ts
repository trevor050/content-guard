/**
 * Public datasets for the benchmark. Nothing here is committed to the repo:
 * every file is downloaded on first run into bench/.cache/ (git-ignored).
 *
 * | Dataset                    | License       | Used for                                   |
 * |----------------------------|---------------|--------------------------------------------|
 * | Civil Comments (Jigsaw)    | CC0 1.0       | toxicity: validation = dev, test = report  |
 * | UCI SMS Spam Collection    | CC BY 4.0     | spam: hashed 50/50 dev/test split          |
 * | Stack Exchange questions   | CC BY-SA      | benign technical/professional text (FPR)   |
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parquetReadObjects } from 'hyparquet'

export interface Example {
  readonly text: string
  readonly label: boolean
}

export interface Split {
  readonly dev: Example[]
  readonly test: Example[]
}

export interface DatasetInfo {
  readonly name: string
  readonly license: string
  readonly source: string
  readonly sha256: Record<string, string>
}

const CACHE = fileURLToPath(new URL('./.cache/', import.meta.url))
mkdirSync(CACHE, { recursive: true })

const CIVIL_REVISION = 'f2970eb3a55777454c94069077cc8d9b5866312d'
const CIVIL_URL = (split: string) =>
  `https://huggingface.co/datasets/google/civil_comments/resolve/${CIVIL_REVISION}/data/${split}-00000-of-00001.parquet`
const SMS_URL = 'https://archive.ics.uci.edu/static/public/228/sms+spam+collection.zip'
const STACK_SITES = ['stackoverflow', 'serverfault', 'superuser', 'security', 'workplace', 'softwareengineering']
const STACK_PAGES = 2

async function download(url: string, file: string): Promise<string> {
  const path = join(CACHE, file)
  if (existsSync(path)) return path
  process.stderr.write(`downloading ${url}\n`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`)
  writeFileSync(path, Buffer.from(await res.arrayBuffer()))
  return path
}

const sha256 = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex')

/** Stable 50/50 split by content hash, so the split never depends on row order. */
const isDev = (key: string) => createHash('md5').update(key).digest()[0]! % 2 === 0

export async function loadCivilComments(): Promise<{ split: Split; info: DatasetInfo }> {
  const files = { validation: await download(CIVIL_URL('validation'), 'civil_validation.parquet'), test: await download(CIVIL_URL('test'), 'civil_test.parquet') }
  const read = async (path: string): Promise<Example[]> => {
    const buf = readFileSync(path)
    const file = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    const rows = (await parquetReadObjects({ file, columns: ['text', 'toxicity'] })) as Array<{ text: string; toxicity: number }>
    return rows.filter((r) => r.text?.trim()).map((r) => ({ text: r.text, label: r.toxicity >= 0.5 }))
  }
  return {
    split: { dev: await read(files.validation), test: await read(files.test) },
    info: {
      name: 'Civil Comments',
      license: 'CC0 1.0',
      source: `huggingface.co/datasets/google/civil_comments@${CIVIL_REVISION.slice(0, 7)}`,
      sha256: { validation: sha256(files.validation), test: sha256(files.test) },
    },
  }
}

export async function loadSmsSpam(): Promise<{ split: Split; info: DatasetInfo }> {
  const zip = await download(SMS_URL, 'sms_spam.zip')
  const options = { encoding: 'utf8' as const, maxBuffer: 64 * 1024 * 1024 }
  // Windows includes PowerShell/.NET ZIP support; it need not have a Unix unzip binary.
  const script = `$ErrorActionPreference='Stop';$ProgressPreference='SilentlyContinue';[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false);Add-Type -AssemblyName System.IO.Compression.FileSystem;$zip=[System.IO.Compression.ZipFile]::OpenRead('${zip.replace(/'/g, "''")}');try{$reader=[System.IO.StreamReader]::new($zip.GetEntry('SMSSpamCollection').Open());try{[Console]::Write($reader.ReadToEnd())}finally{$reader.Dispose()}}finally{$zip.Dispose()}`
  const tsv = process.platform === 'win32'
    ? execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], options)
    : execFileSync('unzip', ['-p', zip, 'SMSSpamCollection'], options)
  const rows = tsv
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const tab = line.indexOf('\t')
      return { text: line.slice(tab + 1), label: line.slice(0, tab) === 'spam' }
    })
  return {
    split: { dev: rows.filter((r) => isDev(r.text)), test: rows.filter((r) => !isDev(r.text)) },
    info: { name: 'UCI SMS Spam Collection', license: 'CC BY 4.0', source: SMS_URL, sha256: { zip: sha256(zip) } },
  }
}

interface StackItem {
  question_id: number
  title: string
  body: string
}

/**
 * Top-voted questions from several Stack Exchange sites, title + body with HTML stripped.
 * These are all treated as benign: the benchmark measures how often they get flagged.
 */
export async function loadStackExchange(): Promise<{ split: Split; info: DatasetInfo }> {
  const path = join(CACHE, 'stackexchange.json')
  if (!existsSync(path)) {
    const items: Array<StackItem & { site: string }> = []
    for (const site of STACK_SITES) {
      for (let page = 1; page <= STACK_PAGES; page++) {
        const url = `https://api.stackexchange.com/2.3/questions?order=desc&sort=votes&site=${site}&pagesize=100&page=${page}&filter=withbody`
        process.stderr.write(`downloading ${url}\n`)
        const res = await fetch(url)
        if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
        const data = (await res.json()) as { items: StackItem[] }
        items.push(...data.items.map((item) => ({ site, question_id: item.question_id, title: item.title, body: item.body })))
      }
    }
    writeFileSync(path, JSON.stringify(items))
  }
  const items = JSON.parse(readFileSync(path, 'utf8')) as Array<StackItem & { site: string }>
  const examples = items.map((item) => ({
    key: `${item.site}:${item.question_id}`,
    text: `${decodeEntities(item.title)}\n${htmlToText(item.body)}`.slice(0, 4000),
    label: false,
  }))
  return {
    split: {
      dev: examples.filter((e) => isDev(e.key)).map(({ text, label }) => ({ text, label })),
      test: examples.filter((e) => !isDev(e.key)).map(({ text, label }) => ({ text, label })),
    },
    info: {
      name: 'Stack Exchange top questions',
      license: 'CC BY-SA (per post)',
      source: `api.stackexchange.com, top ${STACK_PAGES * 100} by votes on ${STACK_SITES.join(', ')}`,
      sha256: { questions: sha256(path) },
    },
  }
}

function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
}
