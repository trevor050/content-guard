import { describe, expect, it } from 'vitest'
import { normalize } from '../src/index.ts'

describe('normalize', () => {
  it.each([
    ['y0u are an 1d10t', 'you are an idiot', 'leetspeak'],
    ['уоu аrе а mоrоn', 'you are a moron', 'homoglyphs'],
    ['id​iot', 'idiot', 'invisible-characters'],
    ['𝔂𝓸𝓾 𝓪𝓻𝓮 𝓪𝓷 𝓲𝓭𝓲𝓸𝓽', 'you are an idiot', 'fancy-unicode'],
    ['ｆｕｃｋ', 'fuck', 'fancy-unicode'],
    ['f u c k', 'fuck', 'spacing'],
    ['k.y.s', 'kys', 'spacing'],
    ['c l a i m   y o u r   p r i z e', 'claim your prize', 'spacing'],
    ['fuuuuuck', 'fuck', 'stretching'],
    ['f*ck', 'fuck', 'censoring'],
    ['sh!t', 'shit', 'leetspeak'],
    ['a$$hole', 'asshole', 'leetspeak'],
    ['i̷̢̛d̴̨̛i̵o̶t̸', 'idiot', 'zalgo'],
  ] as const)('%s -> %s (%s)', (input, decoded, technique) => {
    const result = normalize(input)
    expect(result.decoded).toBe(decoded)
    expect(result.techniques).toContain(technique)
  })

  it('splits glued phrases into known words', () => {
    expect(normalize('killyourself').decoded).toBe('kill yourself')
    expect(normalize('youareanidiot').decoded).toBe('you are an idiot')
  })

  it.each([
    'assassin',
    'Scunthorpe',
    'cocktail',
    'therapist',
    'h264 and x86_64 on ipv6',
    'the Galaxy A55 is a phone',
    'café résumé naïve',
    'v1.2.3 is out',
    'C# and F# developers',
    'rm -rf ./build',
  ])('leaves ordinary text alone: %s', (input) => {
    const result = normalize(input)
    expect(result.techniques).toEqual([])
    expect(result.decoded).not.toMatch(/\b(?:ass|cunt|cock|rapist|fuck|shit)\b/)
  })

  it('does not treat real Cyrillic or Greek text as homoglyph spoofing', () => {
    expect(normalize('Привет, как дела? Всё хорошо.').techniques).toEqual([])
    expect(normalize('Καλημέρα, τι κάνεις;').techniques).toEqual([])
  })

  it('does not flag emoji ZWJ sequences as invisible-character obfuscation', () => {
    expect(normalize('family time 👨‍👩‍👧 ❤️').techniques).toEqual([])
  })

  it('keeps digits, URLs and punctuation in the plain view', () => {
    const result = normalize('Call 0800-123-456 or visit https://Example.com!')
    expect(result.plain).toBe('call 0800-123-456 or visit https://example.com!')
  })

  it('survives regex metacharacters inside censored-looking tokens', () => {
    // Regression: a Civil Comments row crashed the wildcard resolver.
    expect(() => normalize('like???...*maga (a+b)* [x]{2} \\d+')).not.toThrow()
  })

  it('does not resolve short censored words to slurs', () => {
    expect(normalize('read the sp*c first').decoded).not.toContain('spic')
  })
})
