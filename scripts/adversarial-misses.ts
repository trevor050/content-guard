// Lists dev-corpus adversarial failures for every transform (never the holdout seeds).
import { readFileSync } from 'node:fs'
import { analyze } from '../src/index.ts'
import { TRANSFORM_NAMES, TRANSFORMS } from '../bench/obfuscate.ts'
const corpus = JSON.parse(readFileSync(new URL('../corpus/adversarial.json', import.meta.url), 'utf8')).dev // never tune on holdout
for (const name of TRANSFORM_NAMES) {
  const fn = TRANSFORMS[name]
  for (const s of corpus.toxic) { const v = analyze(fn(s)); if (!v.categories.includes('toxicity')) console.log(name, 'MISS toxic', JSON.stringify(fn(s)), '->', v.normalized) }
  for (const s of corpus.spam) { const v = analyze(fn(s)); if (!v.categories.includes('spam')) console.log(name, 'MISS spam', JSON.stringify(fn(s)), '->', v.normalized) }
  for (const s of corpus.benign) { const v = analyze(fn(s)); if (v.flagged) console.log(name, 'FP benign', JSON.stringify(fn(s)), '->', v.normalized, v.reasons.map((r) => r.rule)) }
}
