#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { CATEGORIES, type Category, createGuard, type Verdict } from './index.ts'
import { MAX_INPUT_CHARS } from './input.ts'

const HELP = `Usage: content-guard [options] [text...]

Analyze text for toxicity, spam and keyboard mashing. Reads stdin when no text is given.

Options:
  --json               Print the full verdict as JSON (one object per line with --lines)
  --lines              Treat every stdin line as a separate message
  --threshold <n>      Score at which a category is flagged, 0-1 (default 0.5)
  --only <list>        Comma-separated categories to check: ${CATEGORIES.join(',')}
  --no-context         Do not soften borderline matches in technical text
  -h, --help           Show this help
  -v, --version        Show the version

Exit status: 0 for complete unflagged input, 1 for flagged or truncated input, 2 on usage errors.

Examples:
  content-guard "y0u are an 1d10t"
  echo "Congratulations, you won a prize! Txt CLAIM to 80082" | content-guard --json
  content-guard --lines --only spam < messages.txt`

function fail(message: string): never {
  process.stderr.write(`content-guard: ${message}\n\n${HELP}\n`)
  process.exit(2)
}

let parsed
try {
  parsed = parseArgs({
    allowPositionals: true,
    options: {
      json: { type: 'boolean' },
      lines: { type: 'boolean' },
      threshold: { type: 'string' },
      only: { type: 'string' },
      'no-context': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  })
} catch (error) {
  fail((error as Error).message)
}
const { values, positionals } = parsed

if (values.help) {
  process.stdout.write(`${HELP}\n`)
  process.exit(0)
}
if (values.version) {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }
  process.stdout.write(`${pkg.version}\n`)
  process.exit(0)
}

const threshold = values.threshold === undefined ? undefined : Number(values.threshold)
if (threshold !== undefined && !(threshold > 0 && threshold < 1)) fail('--threshold must be a number between 0 and 1')
const categories = values.only?.split(',').map((c) => c.trim()) as Category[] | undefined
if (categories?.some((c) => !CATEGORIES.includes(c))) fail(`--only accepts ${CATEGORIES.join(', ')}`)

const guard = createGuard({ threshold, categories, contextAware: !values['no-context'] })

let messages: string[]
let stdinChars: number | undefined
if (positionals.length > 0) {
  messages = [positionals.join(' ')]
} else if (process.stdin.isTTY) {
  fail('no text given')
} else {
  // Pipes can be nonblocking (EAGAIN on a large synchronous stdin read).
  process.stdin.setEncoding('utf8')
  const chunks: string[] = []
  let captured = 0
  let received = 0
  const captureLimit = values.lines ? Infinity : MAX_INPUT_CHARS + 1
  for await (const chunk of process.stdin) {
    const text = String(chunk)
    received += text.length
    const keep = text.slice(0, Math.max(0, captureLimit - captured))
    if (keep) chunks.push(keep)
    captured += keep.length
  }
  if (!values.lines) stdinChars = received
  const input = chunks.join('')
  messages = values.lines ? input.split(/\r?\n/).filter((line) => line.trim()) : [input]
}

const color = process.stdout.isTTY && !process.env.NO_COLOR
const paint = (code: number, text: string) => (color ? `\u001b[${code}m${text}\u001b[0m` : text)

function format(text: string, verdict: Verdict): string {
  const scores = CATEGORIES.map((c) => `${c} ${verdict.scores[c].toFixed(2)}`).join('  ')
  const status = verdict.truncated ? paint(31, 'REVIEW (truncated input)') : verdict.flagged ? paint(31, `FLAGGED (${verdict.categories.join(', ')})`) : paint(32, 'OK')
  const lines = [`${status}  ${paint(2, scores)}`]
  if (verdict.truncated) lines.push(`  Input limit reached: analyzed ${verdict.analyzedChars} of ${verdict.inputChars} characters; reject or review the unread tail.`)
  if (messages.length > 1) lines.unshift(paint(1, text.length > 80 ? `${text.slice(0, 77)}...` : text))
  for (const reason of verdict.reasons) {
    lines.push(`  ${paint(2, `+${reason.weight.toFixed(2)}`)} ${reason.rule.padEnd(26)} ${reason.description}`)
  }
  if (verdict.obfuscation.length > 0) lines.push(`  ${paint(33, 'obfuscation:')} ${verdict.obfuscation.join(', ')}`)
  if (verdict.technicalContext) lines.push(`  ${paint(2, 'technical context detected')}`)
  return lines.join('\n')
}

let flagged = false
for (const message of messages) {
  const analyzed = guard.analyze(message)
  const verdict: Verdict = stdinChars !== undefined && stdinChars > analyzed.inputChars
    ? { ...analyzed, flagged: true, truncated: true, inputChars: stdinChars }
    : analyzed
  flagged ||= verdict.flagged
  process.stdout.write(values.json ? `${JSON.stringify(verdict)}\n` : `${format(message, verdict)}\n`)
}
process.exit(flagged ? 1 : 0)
