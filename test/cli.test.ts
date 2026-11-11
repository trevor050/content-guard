import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const CLI = fileURLToPath(new URL('../src/cli.ts', import.meta.url))
const run = (args: string[], input?: string) =>
  spawnSync(process.execPath, [CLI, ...args], { input, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1' } })

describe('cli', () => {
  it('exits 1 and explains when text is flagged', () => {
    const result = run(['y0u are an 1d10t'])
    expect(result.status).toBe(1)
    expect(result.stdout).toContain('FLAGGED (toxicity)')
    expect(result.stdout).toContain('insult:targeted')
    expect(result.stdout).toContain('obfuscation: leetspeak')
  })

  it('exits 0 for clean text read from stdin', () => {
    const result = run([], 'Can we move the sync to Thursday?')
    expect(result.status).toBe(0)
    expect(result.stdout).toMatch(/^OK/)
  })

  it('prints one JSON verdict per line with --lines --json', () => {
    const result = run(['--lines', '--json'], 'hello there\nbuy v1agra now\n')
    const verdicts = result.stdout.trim().split('\n').map((line) => JSON.parse(line))
    expect(verdicts.map((v) => v.flagged)).toEqual([false, true])
  })

  it('rejects bad options with exit code 2', () => {
    expect(run(['--threshold', '7', 'x']).status).toBe(2)
    expect(run(['--only', 'vibes', 'x']).status).toBe(2)
  })

  it('never prints OK or exits zero for an unread tail', () => {
    const result = run([], ' '.repeat(300_000) + 'kill yourself')
    expect(result.status).toBe(1)
    expect(result.stdout).toContain('REVIEW (truncated input)')
    expect(result.stdout).toContain('unread tail')
    const json = run(['--json'], ' '.repeat(300_000) + 'kill yourself')
    expect(JSON.parse(json.stdout).truncated).toBe(true)
  })
})
