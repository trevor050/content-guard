# content-guard: agent notes

Rule-based text moderation library (toxicity, spam, keyboard mash) with obfuscation-resistant normalization. TS source, zero runtime deps, ESM+CJS via tsdown. Published on npm as `content-guard`; this branch is the 5.0.0 rewrite (see CHANGELOG for why 5: npm already has 1.0.0-4.7.1, versions can't be reused).

## Layout
- `src/normalize.ts`: invisible chars -> NFKC (fancy fonts) -> strip marks (zalgo) -> homoglyph map -> lowercase -> `decode()`. Two views: `plain` (keeps digits/URLs/punct; spam rules) and `decoded` (dictionary-guided de-obfuscation; toxicity rules).
- `src/lexicon.ts`: toxicity terms with `p` = Civil Comments *validation* precision, weight = -ln(1-p). `PHRASE_WORDS` + `SPAM_WORDS` = decoder vocabulary.
- `src/detectors/{toxicity,spam,gibberish}.ts`, `src/context.ts` (technical-text softening), `src/guard.ts` (scoring: score = 1 - exp(-sum weights), flag >= threshold), `src/cli.ts`.
- `src/data/*.ts` are generated: `scripts/gen-confusables.ts` (Unicode 17 UTS #39), `scripts/gen-bigrams.ts` (Gutenberg). Don't hand-edit.
- `bench/`: `run.ts` harness, `datasets.ts` (downloads to git-ignored `bench/.cache/`), `baselines.ts`, `obfuscate.ts` transforms, `legacy.ts` (0.3.1 comparison; needs `npm --prefix bench/legacy install`, ~350 MB, delete after).
- `corpus/adversarial.json`: `dev` seeds (tuned against) and `holdout` seeds (never tune on these).
- `docs/`: static playground for GitHub Pages; `docs/content-guard.js` is a build artifact committed on purpose (CI checks it's current).

## Commands
`npm test` · `npm run typecheck` · `npm run build` · `npm run smoke` (pack + install + ESM/CJS/TS/CLI) · `npm run bench` (~2.5 min, writes `bench/results/latest.md`) · `npm run bench -- --split dev --errors` · `npm run demo:build` · `npm run size`.
Scripts are `.ts` run directly by Node (type stripping): needs Node >= 22.18. Imports inside src use `.ts` extensions (allowImportingTsExtensions).

## Invariants / hazards
- Tune ONLY on dev splits (Civil validation, SMS hash-dev half, SE hash-dev half, corpus `dev`). README numbers come from test splits; re-run `npm run bench` and update README tables together after any rule change.
- Decoder only rewrites a token when the result is in the vocabulary. Adding words to `PHRASE_WORDS`/`SPAM_WORDS` widens decoding and glued-word segmentation; re-check Scunthorpe-style tests.
- Mostly-digit short tokens (`a55`) may not decode to lexicon terms (`digitHeavy` guard). Short censored tokens never resolve to slurs (`sp*c`).
- Wildcard resolution builds a RegExp from the token; it must stay restricted to `[a-z*#%_]` (a Civil Comments row once crashed it).
- Context softening never applies to slurs, threats, or targeted insults.
- Homebrew `node@22` on Trevor's Mac is broken (missing simdjson dylib); use `npx -p node@22` to test the floor.

- Input safety: `input.ts` budgets all fields at 250k UTF-16 units; unread tails set `truncated` and fail closed via `flagged`/CLI. Long text uses 20k windows with 512 overlap after padding compaction. Never reintroduce a silent slice or pass unbounded metadata to detectors.
