import { createGuard, type Guard } from './guard.ts'
import type { Input, Verdict } from './types.ts'

export { createGuard, DEFAULT_THRESHOLD, type Guard } from './guard.ts'
export { normalize, type NormalizedText, type Technique } from './normalize.ts'
export type { Category, GuardOptions, Input, Reason, Submission, Verdict } from './types.ts'
export { CATEGORIES } from './types.ts'

let defaultGuard: Guard | undefined

/**
 * Analyze text with the default settings.
 *
 * ```ts
 * import { analyze } from 'content-guard'
 * analyze('y0u are an 1d10t').categories // ['toxicity']
 * ```
 */
export function analyze(input: Input): Verdict {
  defaultGuard ??= createGuard()
  return defaultGuard.analyze(input)
}

/** Shorthand for `analyze(input).flagged`. */
export function isFlagged(input: Input): boolean {
  return analyze(input).flagged
}
