/**
 * Bundles the library into docs/content-guard.js for the static demo page.
 * docs/ is laid out so GitHub Pages can serve it directly (branch: main, folder: /docs).
 *
 *   npm run demo:build
 */
import { build } from 'rolldown'

await build({
  input: 'src/index.ts',
  platform: 'browser',
  output: { file: 'docs/content-guard.js', format: 'esm', minify: true, banner: '/* content-guard, MIT, https://github.com/trevor050/content-guard */' },
})
console.log('wrote docs/content-guard.js')
