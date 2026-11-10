# Changelog

## 5.0.0-rc.0 (unreleased)

A ground-up rewrite. Nothing from the 0.3.x code base survived except the ideas
worth keeping: confusables normalization, keyboard-mash detection and not
flagging technical text. Every number in the README now comes from
`npm run bench`.

### Why 5.0.0 and not 1.0.0

The version history of this package is a mess, and npm never lets a version
number be reused. Between 2025-06-01 and 2025-06-05 the following were
published: 1.0.0, 1.0.1, 1.0.2, 3.0.0, 4.0.0, 4.5.0, 4.7.0 and 4.7.1 (all now
deprecated), then a "reset" to 0.1.0, 0.1.1, 0.1.2 and 0.3.1 (the current
`latest` tag). The "v4.5" and "v4.7" names in old docs and branches refer to
those first releases.

Because 1.0.0 is already taken, the first stable release of the rewrite cannot
be 1.0.0. 5.0.0 is the first major version that is free and sorts above
everything already on the registry, so `npm install content-guard@latest` and
any range like `>=4` behave sensibly.

### Added

- `analyze(input)`, `isFlagged(input)` and `createGuard(options)`: one
  synchronous pipeline with three categories (`toxicity`, `spam`, `gibberish`),
  per-category scores in [0, 1], and a list of human-readable reasons.
- `normalize(text)`, exported on its own: invisible characters, NFKC and
  "fancy font" letters, zalgo marks, Unicode confusables (generated from the
  UTS #39 table), leetspeak, asterisk censoring, spaced-out, dotted, stretched
  and glued letters. Each verdict reports which of these were undone.
- Contact-form input: `{ name, email, subject, message }`, with disposable-email
  and link-in-name signals.
- `blockTerms` and `allowTerms` options.
- A benchmark harness (`npm run bench`) on openly licensed public data, with
  baselines, and an adversarial corpus with a holdout split.
- A static demo page in `docs/`.
- ESM and CommonJS builds with type declarations. Zero runtime dependencies.

### Removed

- The `ContentGuard` class, presets (`strict`, `moderate`, `lenient`, `gaming`,
  `professional`) and the four "variants" (`turbo`, `fast`, `balanced`,
  `large`). The benchmark showed one threshold covers the same trade-offs; see
  the threshold rows in `bench/results/latest.md`.
- The plugin manager and all plugins, including the ML ones. The core no longer
  depends on `@xenova/transformers`, `natural`, `compromise` or eight other
  packages (0.3.1 installed 346 MB across 135 packages).
- The accuracy and latency figures previously in the README. They were not
  reproducible. Measured on the same data, 0.3.1 scores an F1 of 0.039 on SMS
  spam and 0.209 on Civil Comments (`bench/results/legacy.md`).
- The translated READMEs.

### Migrating from 0.3.x

```js
// 0.3.x
const { ContentGuard } = require('content-guard')
const guard = new ContentGuard('moderate')
const result = await guard.analyze({ name, email, subject, message })
if (result.isSpam) reject(result.flags)

// 5.x
const { createGuard } = require('content-guard')
const guard = createGuard() // or createGuard({ threshold: 0.3 }) for stricter
const verdict = guard.analyze({ name, email, subject, message }) // synchronous now
if (verdict.flagged) reject(verdict.reasons.map((r) => r.description))
```

| 0.3.x | 5.x |
| --- | --- |
| `await guard.analyze(input)` | `guard.analyze(input)` (sync; `await` still works) |
| `result.isSpam` | `verdict.flagged` (any category) or `verdict.categories.includes('spam')` |
| `result.score` (unbounded) | `verdict.scores.toxicity` / `.spam` / `.gibberish`, each in [0, 1] |
| `result.riskLevel` | derive from the scores if you need buckets |
| `result.flags` | `verdict.reasons` (each has `rule`, `description`, `match`, `weight`) |
| `new ContentGuard('strict')` | `createGuard({ threshold: 0.3 })` |
| `new ContentGuard('lenient')` | `createGuard({ threshold: 0.7 })` |
| `spamThreshold: n` | `threshold` (0 to 1) |
| `customSpamWords` | `blockTerms` |
| `customWhitelistWords` | `allowTerms` |
| `guard.isSpam(text)` | `isFlagged(text)` |
| `createGuard('balanced')` | `createGuard()` |
| `content-guard "text" --preset strict` | `content-guard "text" --threshold 0.3` |

Node 22 or newer is required.

## 0.3.1 and earlier

Published 2025-06-01 to 2025-06-05. The previous changelog for these releases
described features and benchmark results that the code did not reproduce, so it
has been removed rather than carried forward. The code is still in the git
history before this release.
