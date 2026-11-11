import { describe, expect, it } from 'vitest'
import * as api from '../src/index.ts'
import { analyze, createGuard, isFlagged } from '../src/index.ts'

describe('public API', () => {
  it('exports a small surface', () => {
    expect(Object.keys(api).sort()).toEqual(['CATEGORIES', 'DEFAULT_THRESHOLD', 'analyze', 'createGuard', 'isFlagged', 'normalize'])
  })

  it('returns a complete verdict for clean text', () => {
    expect(analyze('Thanks, see you at the standup tomorrow.')).toEqual({
      flagged: false,
      truncated: false,
      inputChars: 'Thanks, see you at the standup tomorrow.'.length,
      analyzedChars: 'Thanks, see you at the standup tomorrow.'.length,
      categories: [],
      scores: { toxicity: 0, spam: 0, gibberish: 0 },
      reasons: [],
      obfuscation: [],
      technicalContext: false,
      normalized: 'thanks see you at the standup tomorrow',
    })
  })

  it('handles empty, whitespace, emoji-only, non-Latin and very long input', () => {
    for (const text of ['', '   ', '🎉🎉🎉', 'こんにちは世界', 'مرحبا بالعالم', 'a'.repeat(100_000)]) {
      expect(() => analyze(text)).not.toThrow()
    }
    expect(isFlagged('')).toBe(false)
  })

  it('accepts contact-form submissions', () => {
    expect(analyze({ name: 'Ann', email: 'ann@example.com', subject: 'Quote', message: 'Can you send a quote?' }).flagged).toBe(false)
    expect(analyze({ subject: 'URGENT', message: 'verify your account now or it will be suspended' }).categories).toContain('spam')
  })

  it('restricts analysis to the chosen categories', () => {
    const guard = createGuard({ categories: ['spam'] })
    const verdict = guard.analyze('you are an idiot')
    expect(verdict.flagged).toBe(false)
    expect(verdict.reasons).toEqual([])
  })

  it('supports block and allow lists', () => {
    expect(createGuard({ blockTerms: ['frobnicate'] }).isFlagged('go frobnicate')).toBe(true)
    expect(createGuard({ blockTerms: ['frobnicate'] }).isFlagged('go fr0bn1cate')).toBe(true)
    expect(createGuard({ allowTerms: ['damn', 'crap'] }).analyze('damn, crap').scores.toxicity).toBe(0)
  })

  it('can disable context softening', () => {
    const text = 'The `parse()` helper in utils.ts is garbage'
    expect(createGuard({ contextAware: false }).analyze(text).scores.toxicity).toBeGreaterThan(analyze(text).scores.toxicity)
  })

  it('validates options', () => {
    expect(() => createGuard({ threshold: 0 })).toThrow(RangeError)
    expect(() => createGuard({ threshold: 1.5 })).toThrow(RangeError)
    // @ts-expect-error invalid category on purpose
    expect(() => createGuard({ categories: ['nope'] })).toThrow(TypeError)
    expect(() => createGuard({ blockTerms: ['two words'] })).toThrow(TypeError)
  })
})
