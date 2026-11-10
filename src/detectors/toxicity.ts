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
  const isTerm = (word: string) => lexicon.forms.has(word)
  const softenedPhrases = new Set<number>()

  for (let i = 0; i < tokens.length; i++) {
    const term = lexicon.forms.get(tokens[i]!)
    if (!term) continue

    if (isTechnicalTerm(tokens, i)) continue

    const targeted = isTargeted(tokens, i)
    const softening = term.kind === 'insult' ? notInsultingAnyone(tokens, i, targeted, isTerm) : undefined
    const label = term.kind === 'insult' ? 'Insult' : 'Profanity'
    let weight = term.weight
    let rule: string = term.kind
    let description: string
    if (term.kind === 'slur') {
      description = `Slur: "${term.word}"`
    } else if (isNegated(tokens, i)) {
      weight *= 0.3
      description = `${label}: "${tokens[i]}" (softened: negated)`
    } else if (softening) {
      // "I am such an idiot", "he called me an idiot", "the word idiot": the
      // writer is not insulting anyone, so the phrase alone should not flag.
      // Several insults in one such phrase ("I am a stupid idiot") count once.
      if (softenedPhrases.has(softening.start)) continue
      softenedPhrases.add(softening.start)
      weight *= 0.3
      description = `${label}: "${tokens[i]}" (softened: ${softening.why})`
    } else if (targeted) {
      weight *= term.kind === 'insult' ? 1.7 : 1.3
      rule = `${term.kind}:targeted`
      description = `${label} aimed at the reader: "${tokens[i]}"`
    } else {
      description = `${label}: "${tokens[i]}"`
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

// Words allowed between a first-person subject and the insult: "I am such a
// complete idiot", "I was being so stupid", "we were total fools".
const FILLERS = new Set(
  'a an the so such really totally complete completely absolute absolutely utter utterly bit of little kind sort being been be just real biggest big total pretty kinda'.split(' '),
)
const SELF_SUBJECTS: Readonly<Record<string, readonly string[]>> = {
  i: ['am', 'was', 'feel', 'felt', 'must', 'look', 'looked', 'sound', 'sounded', 'can', 'could', 'have', 'had'],
}
// "we're" decodes to "were", which collides with "you were", so it is left out.
const SELF_CONTRACTIONS = new Set(['im', 'ive'])
const NAMING_VERBS = new Set(['call', 'calls', 'called', 'calling', 'named', 'labeled', 'labelled'])
const NAMING_OBJECTS = new Set(['me', 'myself'])
const ARTICLES = new Set(['the', 'a', 'an', 'this', 'that', 'these', 'those', 'such'])
const MENTION_NOUNS = new Set(['word', 'words', 'term', 'terms', 'slur', 'slurs', 'insult', 'insults', 'name', 'names'])

/**
 * Explicit constructions where an insult word is not aimed at anyone else:
 * a first-person subject ("I am such an idiot"), being called something
 * ("he called me an idiot"), self-description after the fact ("what an idiot I
 * am"), or talking about the word itself ("the word idiot"). Proximity alone is
 * not enough: "I think he is an idiot" and "I'm sure you're a moron" still count.
 */
function notInsultingAnyone(
  tokens: readonly string[],
  index: number,
  targeted: boolean,
  isTerm: (word: string) => boolean,
): { why: string; start: number } | undefined {
  // Talking about the word itself: "the word idiot", "a term like libtard".
  const [m1 = '', m2 = '', m3 = ''] = [tokens[index - 1], tokens[index - 2], tokens[index - 3]]
  if ((MENTION_NOUNS.has(m1) && ARTICLES.has(m2)) || (m1 === 'like' && MENTION_NOUNS.has(m2) && (m2.endsWith('s') || ARTICLES.has(m3)))) {
    return { why: 'mentioned, not used', start: index }
  }

  // Walk back over fillers and other lexicon words to where the phrase starts.
  let start = index
  while (start > 0 && start > index - 6 && (FILLERS.has(tokens[start - 1]!) || isTerm(tokens[start - 1]!))) start--
  const one = tokens[start - 1] ?? ''
  const two = tokens[start - 2] ?? ''
  if (SELF_CONTRACTIONS.has(one) || SELF_SUBJECTS[two]?.includes(one)) return { why: 'self-directed', start }
  if (NAMING_OBJECTS.has(one) && NAMING_VERBS.has(two)) return { why: 'reported speech', start }
  // "what an idiot I am" is self-directed unless a "you" says otherwise.
  const after = tokens.slice(index + 1, index + 4).join(' ')
  if (!targeted && /^(?:that )?(?:i am|im|i was|i can be)\b/.test(after)) return { why: 'self-directed', start }
  return undefined
}

// Fixed technical or idiomatic terms that contain a lexicon word but insult no one.
const TECHNICAL_TERMS: ReadonlyArray<readonly [string, RegExp]> = [
  ['dumb', /\bdumb (?:terminals?|pipes?|clients?|components?|phones?|quotes|switch(?:es)?|luck|waiters?|bells?)\b/],
  ['garbage', /\bgarbage (?:collect\w*|in garbage out|values?|data|bytes?|output|truck|disposal)\b|\bgarbage in\b/],
  ['trash', /\b(?:trash (?:cans?|bins?|folder|icon|talk\w*)|empty (?:the )?trash)\b/],
  ['idiot', /\bidiot (?:proof\w*|lights?)\b/],
  ['fool', /\bfool (?:proof\w*)\b|\bfools (?:gold|mate|errand|paradise)\b|\bapril fools?\b/],
  ['pig', /\b(?:guinea|apache) pigs?\b|\bpig (?:latin|iron)\b/],
  ['dick', /\bmoby dick\b|\bphilip k dick\b/],
]
const TECHNICAL_WORDS = new Set(TECHNICAL_TERMS.map(([word]) => word))

function isTechnicalTerm(tokens: readonly string[], index: number): boolean {
  const word = tokens[index]!
  const base = word === 'fools' ? 'fool' : word === 'pigs' ? 'pig' : word
  if (!TECHNICAL_WORDS.has(base)) return false
  const nearby = tokens.slice(Math.max(0, index - 2), index + 4).join(' ')
  return TECHNICAL_TERMS.some(([w, pattern]) => w === base && pattern.test(nearby))
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
