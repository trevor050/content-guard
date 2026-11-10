import { describe, expect, it } from 'vitest'
import { analyze, createGuard } from '../src/index.ts'

const flags = (text: string, category: 'toxicity' | 'spam' | 'gibberish') => analyze(text).categories.includes(category)

describe('toxicity', () => {
  it.each([
    'you are an idiot',
    'shut up you stupid bitch',
    'go kill yourself',
    'i will kill you',
    'fuck off',
    'you worthless piece of shit',
    'what a moron',
  ])('flags: %s', (text) => expect(flags(text, 'toxicity')).toBe(true))

  it.each([
    'kill the process and restart the server',
    'I think this approach is wrong, here is why',
    'the patient was shot in the abdomen and is stable',
    'execute the migration during the maintenance window',
    'you are absolutely right',
    'this is not a stupid question at all',
    "you're not an idiot, the docs are confusing",
    "you're dead wrong about the cache",
  ])('does not flag: %s', (text) => expect(flags(text, 'toxicity')).toBe(false))

  it('weights insults aimed at the reader more than insults about things', () => {
    const aimed = analyze('you are pathetic').scores.toxicity
    const general = analyze('the turnout was pathetic').scores.toxicity
    expect(aimed).toBeGreaterThan(general)
    expect(analyze('you are pathetic').reasons[0]?.rule).toBe('insult:targeted')
  })

  it('softens untargeted borderline words in technical text but never slurs or threats', () => {
    const tech = 'The `fetch()` wrapper in src/api.ts is a garbage design, the retry loop in config.json is broken'
    const verdict = analyze(tech)
    expect(verdict.technicalContext).toBe(true)
    expect(verdict.categories).not.toContain('toxicity')
    expect(analyze('`npm test` failed again, i will kill you').categories).toContain('toxicity')
  })

  it('counts a repeated word once', () => {
    const once = analyze('idiot').scores.toxicity
    expect(analyze('idiot idiot idiot idiot').scores.toxicity).toBe(once)
  })
})

describe('spam', () => {
  it.each([
    'Congratulations! You have won a £1000 cash prize. Txt CLAIM to 81010',
    'Your account has been suspended, verify your account now',
    'Buy cheap viagra online, no prescription',
    'We can get your website on the first page of Google with our SEO services',
    'Double your bitcoin with guaranteed returns',
    'Send me your password to unlock your account',
    'Reply STOP to opt out. Msgs 150p each',
  ])('flags: %s', (text) => expect(flags(text, 'spam')).toBe(true))

  it.each([
    "you won't believe how fast the new build is",
    'Never share your password with anyone, including support staff.',
    'Click the button to download the installer',
    'Our free tier includes 10,000 requests per month',
    'See https://github.com/trevor050/content-guard for the source',
    'I have been wonderful, thanks for asking',
    'love you xxx',
  ])('does not flag: %s', (text) => expect(flags(text, 'spam')).toBe(false))

  it('uses submission fields: disposable email and links in the name', () => {
    const verdict = analyze({ name: 'Best SEO http://cheap-links.biz', email: 'x@mailinator.com', message: 'hello' })
    const rules = verdict.reasons.map((r) => r.rule)
    expect(rules).toContain('spam:link-in-name')
    expect(rules).toContain('spam:disposable-email')
    expect(verdict.categories).toContain('spam')
  })
})

describe('gibberish', () => {
  it.each(['asdfghjkl', 'sdkjfh sdkjfhskdjf lkjsdf', 'jkjkjkjkjk', 'qwrtpsdfg'])('flags: %s', (text) =>
    expect(flags(text, 'gibberish')).toBe(true),
  )

  it.each([
    'hahahahaha',
    'lolololol',
    'soooooo good',
    'strengths and rhythms',
    'run kubectl and mkdir before the pthread test',
    'ok',
    'brb',
    'Przyszedł do mnie wczoraj',
  ])('does not flag: %s', (text) => expect(flags(text, 'gibberish')).toBe(false))
})

describe('scoring', () => {
  it('reports per-category scores in [0, 1] and reasons strongest first', () => {
    const verdict = analyze('you stupid idiot, buy viagra now')
    for (const score of Object.values(verdict.scores)) {
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    }
    const weights = verdict.reasons.map((r) => r.weight)
    expect(weights).toEqual([...weights].sort((a, b) => b - a))
    expect(verdict.categories).toEqual(['toxicity', 'spam'])
  })

  it('lower thresholds are stricter', () => {
    const text = 'that idea is dumb'
    expect(createGuard({ threshold: 0.3 }).isFlagged(text)).toBe(true)
    expect(createGuard({ threshold: 0.7 }).isFlagged(text)).toBe(false)
  })
})
