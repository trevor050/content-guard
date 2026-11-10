import { BIGRAM_COSTS } from '../data/bigrams.ts'
import type { Context } from '../context.ts'
import type { NormalizedText } from '../normalize.ts'
import type { Reason } from '../types.ts'

const COST_STEP = 0.2
const SYMBOLS = 27

/** Average -log10 P(next letter | previous letter), word boundaries included. */
export function letterCost(word: string): number {
  let prev = 0
  let total = 0
  for (let i = 0; i <= word.length; i++) {
    const cur = i < word.length ? word.charCodeAt(i) - 96 : 0
    total += parseInt(BIGRAM_COSTS[prev * SYMBOLS + cur]!, 36) * COST_STEP
    prev = cur
  }
  return total / (word.length + 1)
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']
const KEY_POS = new Map<string, readonly [number, number]>()
ROWS.forEach((row, r) => [...row].forEach((ch, c) => KEY_POS.set(ch, [r, c + r * 0.5])))

/** Share of transitions between neighbouring keys, the signature of a hand rolling across a keyboard. */
export function keyboardAdjacency(word: string): number {
  let adjacent = 0
  for (let i = 1; i < word.length; i++) {
    const a = KEY_POS.get(word[i - 1]!)
    const b = KEY_POS.get(word[i]!)
    if (a && b && Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1.5) adjacent++
  }
  return word.length > 1 ? adjacent / (word.length - 1) : 0
}

// Consonant-heavy words that are fine: tech jargon and a few real English words.
const ALLOW = new Set(
  ('rhythm rhythms strength strengths lengths twelfths nginx kubectl mkdir chmod chown grep sudo ' +
    'pthread stdlib stdio xhtml https sqlx llvm wasm lgtm dmesg fsck html json yaml tsconfig npm pnpm').split(' '),
)

const LAUGHTER = /^(?:a?(?:ha|he|hi|ho|ja|je|ka|lo|xo|ah|eh)+h?|l(?:o+l)+z?|lmf?a+o+|(?:ro)?fl+m?a+o+)$/

export function isMash(raw: string): boolean {
  // Stretched letters ("soooo", "fuuuuck") are emphasis, not mashing.
  const word = raw.replace(/(.)\1{2,}/g, '$1')
  if (word.length < 5 || ALLOW.has(word) || LAUGHTER.test(word)) return false
  if (/^(.{1,3})\1{2,}/.test(word)) return true // "asdasdasd", "jkjkjk"
  if (!/[aeiouy]/.test(word)) return true
  const cost = letterCost(word)
  if (cost >= 2.15) return true
  return word.length >= 6 && cost >= 1.75 && keyboardAdjacency(word) >= 0.6
}

export function detectGibberish(text: NormalizedText, context: Context): Reason[] {
  const words = text.plain
    .replace(/\b(?:https?:\/\/|www\.)\S+|\S+@\S+/g, ' ')
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 2 && /^[a-z]+$/.test(word))
  if (words.length === 0) return []

  const mashed = words.filter(isMash)
  if (mashed.length === 0) return []
  const mashedChars = mashed.reduce((sum, word) => sum + word.length, 0)
  const ratio = mashed.length / words.length
  const sample = mashed.slice(0, 3).join(' ')

  if (words.length <= 3 && mashedChars >= 6) {
    return [{ category: 'gibberish', rule: 'gibberish:mash', description: 'Message is keyboard mashing', match: sample, weight: 1.2 }]
  }
  const needed = context.technical ? 0.6 : 0.4
  if (ratio >= needed && mashedChars >= 10) {
    return [{
      category: 'gibberish',
      rule: 'gibberish:mostly-mash',
      description: `${Math.round(ratio * 100)}% of words look like keyboard mashing`,
      match: sample,
      weight: 1.0,
    }]
  }
  if (ratio >= 0.2 && mashedChars >= 12) {
    return [{ category: 'gibberish', rule: 'gibberish:some-mash', description: 'Contains keyboard mashing', match: sample, weight: 0.4 }]
  }
  return []
}
