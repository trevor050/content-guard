import type { Technique } from './normalize.ts'

export type Category = 'toxicity' | 'spam' | 'gibberish'

export const CATEGORIES: readonly Category[] = ['toxicity', 'spam', 'gibberish']

/** One piece of evidence. Weights add up per category. */
export interface Reason {
  readonly category: Category
  /** Stable machine-readable id, e.g. `insult:targeted` or `spam:shortener-url`. */
  readonly rule: string
  /** Human-readable explanation. */
  readonly description: string
  /** The (normalized) text that triggered the rule. */
  readonly match: string
  /** Contribution to the category score, after context adjustments. */
  readonly weight: number
}

export interface Verdict {
  /** True when any enabled category scored at or above the threshold. */
  readonly flagged: boolean
  /** Categories at or above the threshold. */
  readonly categories: readonly Category[]
  /** Per-category score in [0, 1]. Computed as 1 - exp(-sum of weights). */
  readonly scores: Readonly<Record<Category, number>>
  /** Every rule that fired, strongest first. */
  readonly reasons: readonly Reason[]
  /** Obfuscation techniques that were detected and undone before matching. */
  readonly obfuscation: readonly Technique[]
  /** True when the text looked technical or professional and borderline matches were softened. */
  readonly technicalContext: boolean
  /** The decoded text the toxicity rules ran against. Useful for debugging. */
  readonly normalized: string
}

/** Contact-form style input. Fields are joined for analysis; `email` also feeds spam rules. */
export interface Submission {
  readonly name?: string
  readonly email?: string
  readonly subject?: string
  readonly message?: string
}

export type Input = string | Submission

export interface GuardOptions {
  /** Score at which a category is flagged. Default 0.5. Lower is stricter. */
  readonly threshold?: number
  /** Categories to evaluate. Default: all three. */
  readonly categories?: readonly Category[]
  /** Soften borderline matches in technical or professional text. Default true. */
  readonly contextAware?: boolean
  /** Extra words to treat as toxic (weight 1.0, i.e. flagged on their own). */
  readonly blockTerms?: readonly string[]
  /** Built-in lexicon words to ignore, e.g. `["damn", "crap"]` for a casual community. */
  readonly allowTerms?: readonly string[]
}
