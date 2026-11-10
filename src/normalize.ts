import { CONFUSABLE_SOURCES } from './data/confusables.ts'
import { buildVocabulary, TERMS } from './lexicon.ts'

/** Obfuscation techniques the normalizer can undo. Reported on every verdict. */
export type Technique =
  | 'invisible-characters'
  | 'homoglyphs'
  | 'fancy-unicode'
  | 'zalgo'
  | 'leetspeak'
  | 'censoring'
  | 'spacing'
  | 'stretching'

const TECHNIQUE_ORDER: readonly Technique[] = [
  'invisible-characters',
  'homoglyphs',
  'fancy-unicode',
  'zalgo',
  'leetspeak',
  'censoring',
  'spacing',
  'stretching',
]

export interface NormalizedText {
  /**
   * Unicode-folded, lowercased text with invisible characters removed and
   * homoglyphs mapped to ASCII. Digits, URLs and punctuation are preserved.
   */
  readonly plain: string
  /**
   * `plain` with punctuation removed and obfuscated tokens decoded (leetspeak,
   * censoring, spaced-out or stretched letters). Tokens are only rewritten when
   * the result is a known word, so ordinary text passes through unchanged.
   */
  readonly decoded: string
  /** Techniques that were detected and undone, in a stable order. */
  readonly techniques: readonly Technique[]
}

// Zero-width, bidi-control, filler and tag characters. Emoji ZWJ sequences also
// use U+200D, so these only count as obfuscation when they sit between letters.
const INVISIBLE =
  /[­͏؜ᅟᅠ឴឵᠋-᠏​-‏‪-‮⁠-⁤⁦-⁯ㅤ︀-️﻿ﾠ]|[\u{E0000}-\u{E007F}]/gu
const INVISIBLE_BETWEEN_LETTERS = new RegExp(
  `[\\p{L}\\p{N}](?:${INVISIBLE.source})+[\\p{L}\\p{N}]`,
  'u',
)

const CONFUSABLES: ReadonlyMap<string, string> = new Map(
  Object.entries(CONFUSABLE_SOURCES).flatMap(([ascii, sources]) =>
    [...sources].map((source) => [source, ascii] as const),
  ),
)

// Leetspeak substitutions. Ambiguous characters list every reading; the decoder
// keeps whichever one produces a known word.
const LEET: Readonly<Record<string, readonly string[]>> = {
  '0': ['o'],
  '1': ['i', 'l'],
  '2': ['z'],
  '3': ['e'],
  '4': ['a'],
  '5': ['s'],
  '6': ['g', 'b'],
  '7': ['t'],
  '8': ['b'],
  '9': ['g'],
  '@': ['a'],
  $: ['s'],
  '!': ['i', 'l'],
  '|': ['l', 'i'],
  '+': ['t'],
  '€': ['e'],
  '(': ['c'],
}
const WILDCARDS = new Set(['*', '#', '%', '_'])
const WORD_CHAR = /[a-z0-9@$!|+€*#%(_]/
const LEADING_PUNCT = /^[^a-z0-9@$|*#]+/
const TRAILING_PUNCT = /[^a-z0-9@$*#|+]+$/
const INNER_SEPARATORS = /[.\-_·•,/\\~:]/
const SINGLE_LETTER_WORDS = new Set(['a', 'i', 'u'])
const TWO_LETTER_WORDS = new Set(
  'am an as at be by do go he if in is it me my no of on or so to up us we ur'.split(' '),
)
const MAX_CANDIDATES = 16

interface Decoder {
  readonly vocabulary: ReadonlySet<string>
  readonly slurs: ReadonlySet<string>
  /** Every toxicity-lexicon surface form, including custom block terms. */
  readonly terms: ReadonlySet<string>
  readonly byLength: ReadonlyMap<number, readonly string[]>
  readonly maxWordLength: number
}

export function createDecoder(extraTerms: Iterable<string> = []): Decoder {
  const terms = new Set([...TERMS.flatMap((term) => term.forms), ...extraTerms])
  const vocabulary = buildVocabulary(terms)
  const byLength = new Map<number, string[]>()
  let maxWordLength = 0
  for (const word of vocabulary) {
    const list = byLength.get(word.length) ?? []
    list.push(word)
    byLength.set(word.length, list)
    maxWordLength = Math.max(maxWordLength, word.length)
  }
  const slurs = new Set(TERMS.filter((term) => term.kind === 'slur').flatMap((term) => term.forms))
  return { vocabulary, slurs, terms, byLength, maxWordLength }
}

const DEFAULT_DECODER = createDecoder()

/**
 * Normalize text for matching. Pure and synchronous; safe in any JS runtime.
 */
export function normalize(input: string, decoder: Decoder = DEFAULT_DECODER): NormalizedText {
  const techniques = new Set<Technique>()
  let text = input

  if (INVISIBLE_BETWEEN_LETTERS.test(text)) techniques.add('invisible-characters')
  text = text.replace(INVISIBLE, '')

  let fancy = 0
  for (const ch of text) {
    if (ch.charCodeAt(0) > 0x7f && /^[a-z0-9]$/i.test(ch.normalize('NFKC'))) fancy++
  }
  if (fancy >= 2) techniques.add('fancy-unicode')
  text = text.normalize('NFKC')

  const decomposed = text.normalize('NFD')
  if (/\p{L}\p{M}{3,}/u.test(decomposed)) techniques.add('zalgo')
  text = decomposed.replace(/\p{M}+/gu, '')

  text = mapHomoglyphs(text, techniques)
  const lower = text.toLowerCase()
  const plain = lower.replace(/\s+/g, ' ').trim()
  const decoded = decode(lower, decoder, techniques)

  return {
    plain,
    decoded,
    techniques: TECHNIQUE_ORDER.filter((technique) => techniques.has(technique)),
  }
}

function mapHomoglyphs(text: string, techniques: Set<Technique>): string {
  // Inside words that contain a real Latin letter, look-alikes count as Latin too:
  // "уоu аrе а mоrоn" is Latin text in disguise, "Привет, как дела" is not.
  let latin = 0
  let other = 0
  for (const token of text.split(/\s+/)) {
    const hasLatin = /[a-z]/i.test(token)
    for (const ch of token) {
      if (/[a-z]/i.test(ch) || (hasLatin && CONFUSABLES.has(ch))) latin++
      else if (/\p{L}/u.test(ch)) other++
    }
  }
  const mostlyLatin = latin >= other

  return text.replace(/\S+/g, (token) => {
    const chars = [...token]
    const mapped = chars.map((ch) => CONFUSABLES.get(ch))
    const confusable = mapped.filter(Boolean).length
    if (confusable === 0) return token

    const hasLatin = /[a-z]/i.test(token)
    const letters = chars.filter((ch) => /\p{L}/u.test(ch)).length
    // Mixed-script words are the classic spoof. Whole words made of look-alikes
    // only count when the surrounding text is Latin, so real Greek or Russian
    // text is left alone.
    if (!hasLatin && !(mostlyLatin && confusable === letters)) return token
    techniques.add('homoglyphs')
    return chars.map((ch, i) => mapped[i] ?? ch).join('')
  })
}

function decode(lower: string, decoder: Decoder, techniques: Set<Technique>): string {
  // Pass 1: letters separated by single spaces form one word; wider gaps separate
  // words. "c l a i m   y o u r   p r i z e" -> "claim your prize".
  const unspaced = lower.replace(/(?<![^\s])(?:[^\s] )+[^\s](?![^\s])/g, (run) => {
    const letters = run.replace(/ /g, '')
    if (letters.length === 2) return TWO_LETTER_WORDS.has(letters) ? ` ${letters} ` : run
    for (const candidate of expand(letters)) {
      const segmented = segment(candidate, decoder)
      if (segmented) {
        techniques.add('spacing')
        return ` ${segmented.join(' ')} `
      }
    }
    return letters.length >= 4 ? ` ${letters} ` : run
  })

  // Pass 2: decode each whitespace-delimited chunk on its own.
  const joined: string[] = []
  for (const chunk of unspaced.replace(/['’`]/g, '').split(/\s+/)) {
    if (chunk) for (const word of decodeChunk(chunk, decoder, techniques)) joined.push(word)
  }

  // Pass 3: split glued phrases ("killyourself", "youareanidiot").
  const out: string[] = []
  for (const word of joined) {
    if (word.length >= 6 && /^[a-z]+$/.test(word) && !decoder.vocabulary.has(word)) {
      const segmented = segment(word, decoder)
      if (segmented && segmented.length >= 2 && segmented.some((piece) => piece.length >= 4)) {
        out.push(...segmented)
        continue
      }
    }
    out.push(word)
  }
  return out.join(' ')
}

function decodeChunk(chunk: string, decoder: Decoder, techniques: Set<Technique>): string[] {
  // Letters joined by separators: "f.u.c.k", "k-y-s".
  const pieces = chunk.replace(LEADING_PUNCT, '').replace(TRAILING_PUNCT, '').split(INNER_SEPARATORS)
  if (pieces.length >= 3 && pieces.every((piece) => piece.length === 1 && WORD_CHAR.test(piece))) {
    const candidates = expand(pieces.join(''))
    for (const candidate of candidates) {
      const segmented = segment(candidate, decoder)
      if (segmented) {
        techniques.add('spacing')
        return segmented
      }
    }
    return [pieces.join('')]
  }

  const core = chunk.replace(LEADING_PUNCT, '').replace(TRAILING_PUNCT, '')
  if (!core) return []
  if (/^[a-z]+$/.test(core)) return [destretch(core, decoder, techniques)]

  const letters = core.replace(/[^a-z]/g, '').length
  const obfuscated = letters > 0 && [...core].some((ch) => ch in LEET || WILDCARDS.has(ch))
  // Short tokens that are mostly digits ("a55", "s3x") are usually model numbers.
  // They may decode to everyday words ("d13", "4r3") but not to lexicon terms.
  const digitHeavy = letters === 1 && core.length <= 3 && !/[^a-z0-9]/.test(core)
  if (obfuscated && core.length <= 24) {
    for (const candidate of expand(core)) {
      const wild = [...candidate].some((ch) => WILDCARDS.has(ch))
      const resolved = wild ? resolveWildcards(candidate, decoder) : destretch(candidate, decoder, techniques)
      if (resolved && decoder.vocabulary.has(resolved) && !(digitHeavy && decoder.terms.has(resolved))) {
        techniques.add(wild ? 'censoring' : 'leetspeak')
        return [resolved]
      }
    }
  }

  // Not an obfuscated word: fall back to plain word characters. Unresolved
  // asterisks stay inside the token so "ass*ssin" never yields "ass".
  return core.split(/[^\p{L}\p{N}*#%]+/u).filter(Boolean)
}

/** Expand leetspeak characters into every reading, capped to keep this linear. */
function expand(token: string): string[] {
  let results = ['']
  for (const ch of token) {
    const options = LEET[ch] ?? [ch]
    const next: string[] = []
    for (const prefix of results) {
      for (const option of options) {
        if (next.length < MAX_CANDIDATES) next.push(prefix + option)
      }
    }
    results = next
  }
  return results
}

/** "fuuuuck" -> "fuck", "asssss" -> "ass": squeeze letter runs until a word appears. */
function destretch(word: string, decoder: Decoder, techniques: Set<Technique>): string {
  if (decoder.vocabulary.has(word) || !/(.)\1\1/.test(word)) return word
  for (const squeezed of [word.replace(/(.)\1{2,}/g, '$1'), word.replace(/(.)\1{2,}/g, '$1$1')]) {
    if (decoder.vocabulary.has(squeezed)) {
      techniques.add('stretching')
      return squeezed
    }
  }
  return word
}

/** "f*ck" -> "fuck". Needs at least two real letters and a unique-length match. */
function resolveWildcards(token: string, decoder: Decoder): string | undefined {
  if (token.length < 4 || !/^[a-z][a-z*#%_]+$/.test(token)) return undefined
  const fixed = [...token].filter((ch) => /[a-z]/.test(ch)).length
  if (fixed < 2) return undefined
  const pattern = new RegExp(`^${token.replace(/[*#%_]/g, '[a-z]')}$`)
  const matches = decoder.byLength.get(token.length)?.filter((word) => pattern.test(word)) ?? []
  // Short censored words are ambiguous ("sp*c" is usually "spec"); only resolve
  // them to a slur when the token is long enough to be unambiguous.
  return matches.find((word) => word.length >= 5 || !decoder.slurs.has(word))
}

/**
 * Split a run of letters into known words, fewest pieces first. Returns undefined
 * unless the whole string is covered, which is what prevents "assassin" from
 * becoming "ass ass in".
 */
function segment(letters: string, decoder: Decoder): string[] | undefined {
  const n = letters.length
  if (n > 48) return undefined
  if (decoder.vocabulary.has(letters)) return [letters]
  const best: Array<string[] | undefined> = Array.from({ length: n + 1 })
  best[0] = []
  for (let end = 1; end <= n; end++) {
    for (let start = Math.max(0, end - decoder.maxWordLength); start < end; start++) {
      const prev = best[start]
      if (!prev) continue
      const piece = letters.slice(start, end)
      if (piece.length === 1 && !SINGLE_LETTER_WORDS.has(piece)) continue
      if (!decoder.vocabulary.has(piece)) continue
      const candidate = [...prev, piece]
      const current = best[end]
      if (!current || candidate.length < current.length) best[end] = candidate
    }
  }
  const result = best[n]
  return result && result.length <= 6 ? result : undefined
}
