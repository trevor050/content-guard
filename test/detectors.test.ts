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

describe('who an insult is aimed at', () => {
  // Regression cases reported in review, verbatim.
  it.each([
    'ugh I am such an idiot, I forgot my keys again',
    'he called me an idiot and I reported him to the moderators',
    'the master branch aborted because the slave replica was a dumb terminal',
  ])('does not flag: %s', (text) => expect(analyze(text).flagged).toBe(false))

  it.each([
    "I'm so stupid, I deleted the wrong folder",
    'I was being a complete idiot yesterday',
    'what an idiot I am',
    'I am a stupid idiot',
    'she said I was stupid',
    'my brother called me a moron at dinner',
    'they keep calling me a loser',
    'the word "idiot" is not allowed in this channel',
    'please stop using words like libtard here',
  ])('softens self-directed, reported and mentioned insults: %s', (text) => {
    const verdict = analyze(text)
    expect(verdict.flagged).toBe(false)
    expect(verdict.reasons.some((r) => /self-directed|reported speech|mentioned/.test(r.description))).toBe(true)
  })

  it.each([
    'I am not saying you are an idiot, but you are an idiot',
    'someone should tell you that you are worthless',
    "you're the idiot, I am not",
    "I'm sure you're a moron",
    'you called me an idiot, you idiot',
    'I think he is an idiot',
    'I am talking to an idiot',
    'Enjoy your one term, asshole.',
    'in other words, a parasite.',
    'Suppose you were an idiot',
  ])('still flags: %s', (text) => expect(analyze(text).categories).toContain('toxicity'))

  it('never softens slurs, threats or profanity in these constructions', () => {
    expect(analyze('he called me a faggot').categories).toContain('toxicity')
    expect(analyze('I am going to kill you, idiot').categories).toContain('toxicity')
    expect(analyze("I'm such a fucking idiot").reasons.some((r) => r.rule === 'profanity')).toBe(true)
  })
})

describe('technical terms that contain insult words', () => {
  it.each([
    'it is just a dumb terminal on the network',
    'the modem is a dumb pipe, all the logic lives in the router',
    'split it into smart and dumb components',
    'the garbage collector pauses for 200ms',
    'garbage in, garbage out',
    'drag it to the trash bin',
    'we need an idiot-proof installer',
    'make the form foolproof and fool-proof',
    'I volunteered as a guinea pig for the beta',
    'add a dummy variable for each region',
    'that is a killer feature',
    'master/slave replication is deprecated in favor of primary/replica',
    'abort the transaction and retry',
    'fatal error: kill -9 the hung process',
    'execute the script and terminate the worker',
    'the child process was killed by the OOM killer',
    'Moby Dick is a long book',
  ])('does not flag: %s', (text) => expect(analyze(text).flagged).toBe(false))

  it('still flags the same words used as insults', () => {
    expect(analyze('you are a dumb terminal of a person, idiot').categories).toContain('toxicity')
    expect(analyze('your code is garbage and so are you, moron').categories).toContain('toxicity')
  })
})
