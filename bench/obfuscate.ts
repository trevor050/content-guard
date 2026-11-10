/**
 * Deterministic obfuscation transforms used by the adversarial corpus.
 * Each one models a trick seen in the wild for slipping past word filters.
 */

const LEET: Record<string, string> = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' }
const CYRILLIC: Record<string, string> = { a: 'а', e: 'е', o: 'о', c: 'с', p: 'р', x: 'х', y: 'у', i: 'і' }
const words = (text: string) => text.split(' ')

function mathBoldScript(ch: string): string {
  if (/[a-z]/.test(ch)) return String.fromCodePoint(0x1d4ea + ch.charCodeAt(0) - 97)
  if (/[A-Z]/.test(ch)) return String.fromCodePoint(0x1d4d0 + ch.charCodeAt(0) - 65)
  return ch
}

const leetspeak = (text: string) => text.replace(/[aeiost]/gi, (ch) => LEET[ch.toLowerCase()] ?? ch)
const homoglyphs = (text: string) => text.replace(/[aeocpxyi]/g, (ch) => CYRILLIC[ch] ?? ch)
const zeroWidth = (text: string) => words(text).map((w) => [...w].join('\u200b')).join(' ')

export const TRANSFORMS = {
  /** No change: the baseline detection rate. */
  clean: (text: string) => text,
  /** "y0u 4r3 4n 1d10t" */
  leetspeak,
  /** Cyrillic look-alikes swapped in for Latin letters. */
  homoglyphs,
  /** U+200B between every letter. */
  'zero-width': zeroWidth,
  /** "f u c k  y o u" */
  spacing: (text: string) => words(text).map((w) => [...w].join(' ')).join('   '),
  /** "f.u.c.k y.o.u" */
  dots: (text: string) => words(text).map((w) => (w.length >= 3 ? [...w].join('.') : w)).join(' '),
  /** "fuuuuck yooouuu" */
  stretching: (text: string) => text.replace(/([aeiou])/g, '$1$1$1$1'),
  /** Mathematical bold script letters, the "fancy font" generators. */
  'fancy-unicode': (text: string) => [...text].map(mathBoldScript).join(''),
  /** "f*cking id*ot": first inner vowel of long words replaced by an asterisk. */
  censoring: (text: string) => words(text).map((w) => (w.length >= 4 ? w.replace(/(?<=^.+?)[aeiou]/, '*') : w)).join(' '),
  /** "youareanidiot" */
  'no-spaces': (text: string) => text.replace(/\s+/g, ''),
  /** Leetspeak, homoglyphs and zero-width characters together. */
  combined: (text: string): string => zeroWidth(homoglyphs(leetspeak(text))),
} satisfies Record<string, (text: string) => string>

export type TransformName = keyof typeof TRANSFORMS
export const TRANSFORM_NAMES = Object.keys(TRANSFORMS) as TransformName[]
