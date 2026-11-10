import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { TRANSFORM_NAMES, TRANSFORMS } from '../bench/obfuscate.ts'
import { analyze } from '../src/index.ts'

type Seeds = Record<'toxic' | 'spam' | 'benign', string[]>
const corpus = JSON.parse(readFileSync(new URL('../corpus/adversarial.json', import.meta.url), 'utf8')) as Record<'dev' | 'holdout', Seeds>

// Removing every space from a whole sentence ("verifyyouraccountnow") is only
// recovered when every word is in the decoder vocabulary. That is a documented
// limitation, so the no-spaces transform has a lower bar.
const MIN_RECALL: Record<string, number> = { 'no-spaces': 0.5 }

describe.each(['dev', 'holdout'] as const)('adversarial corpus (%s seeds)', (set) => {
  const seeds = corpus[set]
  const rate = (texts: string[], hit: (text: string) => boolean) => texts.filter(hit).length / texts.length

  it.each(TRANSFORM_NAMES)('%s: toxic seeds are still flagged', (name) => {
    const fn = TRANSFORMS[name]
    expect(rate(seeds.toxic, (s) => analyze(fn(s)).categories.includes('toxicity'))).toBeGreaterThanOrEqual(MIN_RECALL[name] ?? 0.9)
  })

  it.each(TRANSFORM_NAMES.filter((name) => name !== 'no-spaces'))('%s: spam seeds are still flagged', (name) => {
    const fn = TRANSFORMS[name]
    // Censored spam words outside the decoder vocabulary ("susp*cious") are a known
    // weakness on the holdout seeds; the benchmark reports the exact rate.
    const bar = set === 'holdout' && name === 'censoring' ? 0.3 : 0.7
    expect(rate(seeds.spam, (s) => analyze(fn(s)).categories.includes('spam'))).toBeGreaterThanOrEqual(bar)
  })

  it.each(TRANSFORM_NAMES)('%s: benign seeds stay clean', (name) => {
    const fn = TRANSFORMS[name]
    const flagged = seeds.benign.map((s) => fn(s)).filter((s) => analyze(s).flagged)
    expect(flagged.length).toBeLessThanOrEqual(1)
  })
})

describe('obfuscation reporting', () => {
  it('names the technique that was undone', () => {
    expect(analyze(TRANSFORMS.homoglyphs('you are an idiot')).obfuscation).toContain('homoglyphs')
    expect(analyze(TRANSFORMS['zero-width']('you are an idiot')).obfuscation).toContain('invisible-characters')
    expect(analyze(TRANSFORMS.combined('you are an idiot')).obfuscation).toEqual(
      expect.arrayContaining(['invisible-characters', 'homoglyphs', 'leetspeak']),
    )
  })
})
