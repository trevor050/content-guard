import type { Submission } from './types.ts'

// Deterministic work limits, rather than machine-dependent wall-clock deadlines.
export const MAX_INPUT_CHARS = 250_000
export const WINDOW_CHARS = 20_000
export const WINDOW_OVERLAP = 512

/** Bound every field before joining or scanning it. Counts are UTF-16 code units. */
export function boundedInput(submission: Submission) {
  const fields = [submission.name, submission.subject, submission.message]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
  const email = typeof submission.email === 'string' ? submission.email : ''
  const inputChars = fields.reduce((sum, field) => sum + field.length, Math.max(0, fields.length - 1)) + email.length
  let remaining = MAX_INPUT_CHARS
  const parts: string[] = []
  for (const field of fields) {
    if (parts.length && remaining > 0) { parts.push('\n'); remaining-- }
    const part = field.slice(0, remaining)
    parts.push(part)
    remaining -= part.length
    if (!remaining) break
  }
  const boundedEmail = email.slice(0, remaining)
  const text = parts.join('')
  const analyzedChars = text.length + boundedEmail.length
  return {
    text,
    name: typeof submission.name === 'string' ? submission.name.slice(0, MAX_INPUT_CHARS) : undefined,
    email: boundedEmail || undefined,
    inputChars,
    analyzedChars,
    truncated: analyzedChars < inputChars,
  }
}

export function* inputWindows(text: string): Generator<string> {
  for (let start = 0; ; start += WINDOW_CHARS - WINDOW_OVERLAP) {
    yield text.slice(start, start + WINDOW_CHARS)
    if (start + WINDOW_CHARS >= text.length) return
  }
}
