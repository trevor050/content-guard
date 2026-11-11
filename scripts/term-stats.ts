// Dev-split precision of individual words and rules. Used to calibrate lexicon weights.
import { createGuard } from '../src/index.ts'
import { FORM_INDEX } from '../src/lexicon.ts'
import { loadCivilComments } from '../bench/datasets.ts'
const { split } = await loadCivilComments()
const g = createGuard()
const candidates = process.argv.slice(2)
const stat = new Map<string, [number, number]>()
const bump = (k: string, label: boolean) => { const s = stat.get(k) ?? [0, 0]; s[label ? 0 : 1]++; stat.set(k, s) }
for (const { text, label } of split.dev) {
  const v = g.analyze(text)
  const words = new Set(v.normalized.split(' '))
  for (const w of words) if (FORM_INDEX.has(w) || candidates.includes(w)) bump('w:' + w, label)
  for (const r of v.reasons) if (r.category === 'toxicity' && !FORM_INDEX.has(r.match)) bump(r.rule + ':' + r.match, label)
  for (const r of v.reasons) if (r.rule.includes('targeted')) bump('targeted:' + r.match, label)
}
const rows = [...stat].filter(([, [p, n]]) => p + n >= 8).map(([k, [p, n]]) => `${k} ${p}/${p + n}=${(p / (p + n)).toFixed(2)}`)
console.log(rows.sort().join('\n'))
