import { describe, expect, it } from 'vitest'
import { analyze, createGuard, isFlagged, normalize } from '../src/index.ts'

const paddings = [
  ['spaces', ' '.repeat(25_000)],
  ['newlines', '\n'.repeat(25_000)],
  ['invisible', '\u200b'.repeat(25_000)],
  ['repeated characters', 'a'.repeat(25_000)],
  ['benign filler', 'Thanks for reading this ordinary update. '.repeat(900)],
] as const

describe('long-input coverage', () => {
  for (const [name, padding] of paddings) {
    it.each([
      `${padding} you are an idiot`,
      `you are an idiot ${padding}`,
      `${padding} you are an idiot ${padding}`,
      `${padding} kill yourself ${padding}`,
    ])(`finds abuse around ${name} padding`, (text) => {
      const verdict = analyze(text)
      expect(verdict.flagged).toBe(true)
      expect(verdict.categories).toContain('toxicity')
      expect(verdict.truncated).toBe(false)
    })
    it(`finds both abusive parts with ${name} padding between them`, () => {
      const verdict = analyze(`you are an idiot ${padding} kill yourself`)
      expect(verdict.reasons.some((r) => r.match === 'idiot')).toBe(true)
      expect(verdict.reasons.some((r) => r.rule === 'threat:self-harm')).toBe(true)
      expect(verdict.truncated).toBe(false)
    })
  }

  it.each([' '.repeat(25_000), '\n'.repeat(25_000), '\u200b'.repeat(25_000)])('finds a threat across long separator padding', (padding) => {
    expect(analyze(`kill${padding}yourself`).categories).toContain('toxicity')
  })

  it('finds a threat across a window boundary and does not count overlapping matches twice', () => {
    const text = 'ordinary update '.repeat(1249) + 'extra filler kill yourself ' + 'ordinary update '.repeat(1400)
    const verdict = analyze(text)
    expect(verdict.categories).toContain('toxicity')
    expect(verdict.reasons.filter((r) => r.rule === 'threat:self-harm')).toHaveLength(1)
  })

  it('does not let distant technical padding soften an insult elsewhere', () => {
    const text = 'server database query compiler function '.repeat(1500) + '\nYou are an idiot.'
    expect(analyze(text).categories).toContain('toxicity')
  })

  it('covers all submission text fields', () => {
    expect(analyze({ name: 'n'.repeat(25_000), subject: 'hello', message: 'kill yourself' }).categories).toContain('toxicity')
  })

  it('fails closed and reports incomplete coverage beyond its hard work limit', () => {
    const text = ' '.repeat(2_000_000) + 'kill yourself'
    const verdict = analyze(text)
    expect(verdict.truncated).toBe(true)
    expect(verdict.analyzedChars).toBeLessThan(verdict.inputChars)
    expect(verdict.inputChars).toBe(text.length)
    expect(verdict.flagged).toBe(true)
    expect(isFlagged(text)).toBe(true)
    expect(createGuard({ categories: [] }).isFlagged(text)).toBe(true)
  })

  it('bounds metadata too, instead of scanning an unbounded email field', () => {
    const verdict = analyze({ message: 'hello', email: 'a'.repeat(2_000_000) })
    expect(verdict.truncated).toBe(true)
    expect(verdict.flagged).toBe(true)
  })

  it('stays bounded on long adversarial inputs', () => {
    const start = performance.now()
    for (const text of ['!'.repeat(250_000), 'a '.repeat(125_000), '('.repeat(250_000), '\u200b'.repeat(250_000), 'hello '.repeat(40_000)]) {
      expect(() => analyze(text)).not.toThrow()
    }
    expect(performance.now() - start).toBeLessThan(3000)
  })

  it('does not rescan a long internal punctuation run while trimming a token', () => {
    const start = performance.now()
    expect(normalize('a' + '!'.repeat(100_000) + 'b').decoded).toBe('a b')
    expect(performance.now() - start).toBeLessThan(1000)
  })
})
