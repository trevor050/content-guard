import type { Context } from '../context.ts'
import type { Term } from '../lexicon.ts'
import type { NormalizedText } from '../normalize.ts'
import type { Reason } from '../types.ts'

interface PhraseRule {
  readonly rule: string
  readonly description: string
  readonly pattern: RegExp
  readonly weight: number
}

const YOU = '(?:you|u|ya)'
const YOUR = '(?:your|ur|youre)'

// Phrase rules run on the decoded text: lowercase, no punctuation, no apostrophes.
const PHRASES: readonly PhraseRule[] = [
  {
    rule: 'threat:self-harm',
    description: 'Encourages someone to kill or hurt themselves',
    pattern: new RegExp(
      `\\b(?:kill|hang|shoot|hurt) (?:${YOUR} ?self|yourselves)\\b|\\bkys\\b|\\b(?:go|just|pls|please) die\\b|\\bdrink bleach\\b|\\b${YOU} (?:should|deserve to|ought to) (?:die|be (?:dead|shot|killed|hanged))\\b|\\bhope ${YOU} (?:die|get cancer|get (?:hit|shot|raped))\\b`,
    ),
    weight: 2.5,
  },
  {
    rule: 'threat:violence',
    description: 'Threatens violence against the reader',
    pattern: new RegExp(
      `\\b(?:i|1)(?: will|ll| am going to| am gonna|m gonna|m going to| want to) (?:kill|murder|shoot|stab|hurt|beat|rape|find) ${YOU}\\b|\\bi know where ${YOU} live\\b|\\bwatch ${YOUR} back\\b|\\b${YOU}(?: are|re) (?:dead meat|going to die)\\b`,
    ),
    weight: 2.2,
  },
  {
    rule: 'harassment:fuck-off',
    description: 'Tells someone to fuck off',
    pattern: new RegExp(`\\b(?:fuck|screw) (?:off|${YOU})\\b|\\bgo (?:fuck|screw) ${YOUR}self\\b`),
    weight: 1.0,
  },
  {
    rule: 'harassment:go-to-hell',
    description: 'Tells someone to go to hell or piss off',
    pattern: /\bgo to hell\b|\bpiss off\b|\brot in hell\b/,
    weight: 1.2,
  },
  {
    rule: 'harassment:hate-you',
    description: 'Hostile statement aimed at the reader',
    pattern: new RegExp(`\\bi hate ${YOU}\\b|\\b(?:nobody|no one) (?:likes|cares about|wants) ${YOU}\\b`),
    weight: 0.9,
  },
  {
    rule: 'harassment:shut-up',
    description: 'Tells someone to shut up',
    pattern: new RegExp(`\\bshut (?:the fuck |${YOUR} (?:mouth|face) )?up\\b`),
    weight: 0.35,
  },
  {
    rule: 'insult:phrase',
    description: 'Common insulting phrase',
    pattern: /\bpiece of (?:shit|garbage|trash|crap)\b|\bson of a bitch\b|\beat shit\b|\bsuck my\b|\b(?:waste of (?:space|oxygen|skin))\b|\boxygen thief\b/,
    weight: 2.0,
  },
]

const SECOND_PERSON = new Set(['you', 'u', 'ya', 'your', 'ur', 'youre', 'yourself', 'yall', 'yourselves'])
const NEGATIONS = new Set(['not', 'never', 'no', 'isnt', 'arent', 'wasnt', 'werent', 'aint', 'nobody'])
const AIMED_AFTER = new Set(['you', 'u', 'ya', 'yourself', 'off'])
const WINDOW = 4

export interface ToxicityLexicon {
  readonly forms: ReadonlyMap<string, Term>
}

export function detectToxicity(text: NormalizedText, context: Context, lexicon: ToxicityLexicon): Reason[] {
  const reasons: Reason[] = []
  const tokens = text.decoded.split(' ')
  const seen = new Map<string, number>()

  for (let i = 0; i < tokens.length; i++) {
    const term = lexicon.forms.get(tokens[i]!)
    if (!term) continue

    const targeted = isTargeted(tokens, i)
    let weight = term.weight
    let rule: string = term.kind
    let description: string
    if (term.kind === 'slur') {
      description = `Slur: "${term.word}"`
    } else if (isNegated(tokens, i)) {
      weight *= 0.3
      description = `${term.kind === 'insult' ? 'Insult' : 'Profanity'}: "${tokens[i]}" (softened: negated)`
    } else if (targeted) {
      weight *= term.kind === 'insult' ? 1.7 : 1.3
      rule = `${term.kind}:targeted`
      description = `${term.kind === 'insult' ? 'Insult' : 'Profanity'} aimed at the reader: "${tokens[i]}"`
    } else {
      description = `${term.kind === 'insult' ? 'Insult' : 'Profanity'}: "${tokens[i]}"`
      if (context.technical) {
        weight *= 0.4
        description += ' (softened: technical context)'
      }
    }

    // Count each term once; keep the strongest occurrence.
    const previous = seen.get(term.word)
    if (previous !== undefined) {
      if (reasons[previous]!.weight >= weight) continue
      reasons[previous] = { category: 'toxicity', rule, description, match: tokens[i]!, weight: round(weight) }
      continue
    }
    seen.set(term.word, reasons.length)
    reasons.push({ category: 'toxicity', rule, description, match: tokens[i]!, weight: round(weight) })
  }

  for (const phrase of PHRASES) {
    const match = phrase.pattern.exec(text.decoded)
    if (match) {
      reasons.push({
        category: 'toxicity',
        rule: phrase.rule,
        description: phrase.description,
        match: match[0],
        weight: phrase.weight,
      })
    }
  }
  return reasons
}

/** "not stupid", "isn't an idiot", "never a jerk". */
function isNegated(tokens: readonly string[], index: number): boolean {
  for (let j = index - 1; j >= Math.max(0, index - 3); j--) {
    if (NEGATIONS.has(tokens[j]!)) return true
  }
  return false
}

/** A second-person pronoun shortly before the word, or "you"/"off" right after it. */
function isTargeted(tokens: readonly string[], index: number): boolean {
  if (AIMED_AFTER.has(tokens[index + 1] ?? '')) return true
  for (let j = index - 1; j >= Math.max(0, index - WINDOW); j--) {
    const token = tokens[j]!
    if (NEGATIONS.has(token)) return false
    if (SECOND_PERSON.has(token)) return true
  }
  return false
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}
