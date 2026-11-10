import { detectContext } from './context.ts'
import { detectGibberish } from './detectors/gibberish.ts'
import { detectSpam } from './detectors/spam.ts'
import { detectToxicity, type ToxicityLexicon } from './detectors/toxicity.ts'
import { FORM_INDEX, type Term } from './lexicon.ts'
import { createDecoder, normalize } from './normalize.ts'
import { CATEGORIES, type Category, type GuardOptions, type Input, type Reason, type Verdict } from './types.ts'

export const DEFAULT_THRESHOLD = 0.5

export interface Guard {
  /** Analyze one message or contact-form submission. Synchronous and side-effect free. */
  analyze(input: Input): Verdict
  /** Shorthand for `analyze(input).flagged`. */
  isFlagged(input: Input): boolean
  readonly options: Readonly<Required<Omit<GuardOptions, 'blockTerms' | 'allowTerms'>>>
}

/**
 * Build a guard with fixed options. Reuse it: construction compiles the lexicon.
 */
export function createGuard(options: GuardOptions = {}): Guard {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  if (!(threshold > 0 && threshold < 1)) throw new RangeError('threshold must be between 0 and 1 (exclusive)')
  const categories = options.categories ?? CATEGORIES
  for (const category of categories) {
    if (!CATEGORIES.includes(category)) throw new TypeError(`unknown category "${category}"`)
  }
  const contextAware = options.contextAware ?? true

  const lexicon = buildLexicon(options.blockTerms ?? [], options.allowTerms ?? [])
  const decoder = createDecoder(lexicon.forms.keys())
  const enabled = new Set(categories)

  function analyze(input: Input): Verdict {
    const submission = typeof input === 'string' ? { message: input } : (input ?? {})
    if (typeof submission !== 'object') throw new TypeError('input must be a string or a submission object')
    const original = [submission.name, submission.subject, submission.message]
      .filter((part): part is string => typeof part === 'string' && part.length > 0)
      .join('\n')
      .slice(0, 20_000)

    const text = normalize(original, decoder)
    const context = contextAware ? detectContext(original, text.plain) : { technical: false, signals: [] }

    const reasons: Reason[] = []
    if (enabled.has('toxicity')) reasons.push(...detectToxicity(text, context, lexicon))
    if (enabled.has('spam')) {
      reasons.push(...detectSpam(text, context, { original, email: submission.email, name: submission.name }))
    }
    if (enabled.has('gibberish')) reasons.push(...detectGibberish(text, context))
    reasons.sort((a, b) => b.weight - a.weight)

    const scores = { toxicity: 0, spam: 0, gibberish: 0 } as Record<Category, number>
    for (const category of CATEGORIES) {
      const total = reasons.reduce((sum, r) => (r.category === category ? sum + r.weight : sum), 0)
      scores[category] = Math.round((1 - Math.exp(-total)) * 1000) / 1000
    }
    const flaggedCategories = CATEGORIES.filter((c) => enabled.has(c) && scores[c] >= threshold)

    return {
      flagged: flaggedCategories.length > 0,
      categories: flaggedCategories,
      scores,
      reasons,
      obfuscation: text.techniques,
      technicalContext: context.technical,
      normalized: text.decoded,
    }
  }

  return {
    analyze,
    isFlagged: (input) => analyze(input).flagged,
    options: { threshold, categories, contextAware },
  }
}

function buildLexicon(blockTerms: readonly string[], allowTerms: readonly string[]): ToxicityLexicon {
  if (blockTerms.length === 0 && allowTerms.length === 0) return { forms: FORM_INDEX }
  const forms = new Map<string, Term>(FORM_INDEX)
  const allowed = new Set(allowTerms.map((word) => word.toLowerCase().trim()))
  for (const [form, term] of forms) {
    if (allowed.has(form) || allowed.has(term.word)) forms.delete(form)
  }
  for (const raw of blockTerms) {
    const word = raw.toLowerCase().trim()
    if (!/^[a-z]+$/.test(word)) throw new TypeError(`blockTerms must be single words of letters a-z, got "${raw}"`)
    forms.set(word, { word, kind: 'profanity', weight: 1.0, forms: [word] })
  }
  return { forms }
}
