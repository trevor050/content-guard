// Dev-split audit: which comments the self-directed / reported-speech / mention softening clears, and how raters labeled them.
import { createGuard } from '../src/index.ts'
import { loadCivilComments } from '../bench/datasets.ts'
const { split } = await loadCivilComments()
const g = createGuard()
const stats = new Map<string, [number, number]>()
const examples = new Map<string, string[]>()
for (const { text, label } of split.dev) {
  const v = g.analyze(text)
  for (const r of v.reasons) {
    const m = /softened: (self-directed|reported speech|mentioned, not used)/.exec(r.description)
    if (!m) continue
    if (v.flagged) continue // only count comments the softening actually cleared
    const s = stats.get(m[1]!) ?? [0, 0]
    s[label ? 0 : 1]++
    stats.set(m[1]!, s)
    if (label) { const e = examples.get(m[1]!) ?? []; if (e.length < 8) e.push(text.slice(0, 140)); examples.set(m[1]!, e) }
  }
}
for (const [k, [tox, clean]] of stats) console.log(`${k}: toxic ${tox}, non-toxic ${clean}, share toxic ${(tox / (tox + clean)).toFixed(2)}`)
for (const [k, e] of examples) console.log(`\n${k} toxic examples:\n  ` + e.join('\n  '))
