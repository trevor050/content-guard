/**
 * Packs the library, installs the tarball into a throwaway project and imports it
 * from ESM, CommonJS and TypeScript (both module flavors), then runs the CLI bin.
 * Everything happens inside .smoke/ (git-ignored) and is deleted afterwards.
 *
 *   npm run smoke
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { runNpm } from './npm.ts'

const root = resolve(import.meta.dirname, '..')
const dir = join(root, '.smoke')
const app = join(dir, 'app')
const run = (cmd: 'npm' | 'node', args: string[], cwd = app) => cmd === 'npm'
  ? runNpm(args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
  : execFileSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })

rmSync(dir, { recursive: true, force: true })
mkdirSync(app, { recursive: true })
try {
  run('npm', ['pack', '--pack-destination', dir], root)
  const tarball = readdirSync(dir).find((f) => f.endsWith('.tgz'))!
  writeFileSync(join(app, 'package.json'), JSON.stringify({ name: 'smoke', private: true }))
  run('npm', ['install', '--no-audit', '--no-fund', join(dir, tarball)])

  writeFileSync(join(app, 'esm.mjs'), `import { analyze, createGuard } from 'content-guard'
if (!analyze('y0u 4r3 4n 1d10t').flagged) throw new Error('ESM: expected flag')
if (createGuard({ threshold: 0.7 }).isFlagged('hello')) throw new Error('ESM: unexpected flag')
console.log('esm ok')
`)
  writeFileSync(join(app, 'cjs.cjs'), `const { analyze, normalize } = require('content-guard')
if (!analyze('Congratulations! You have won a £1000 cash prize. Txt CLAIM to 81010').categories.includes('spam')) throw new Error('CJS: expected spam')
if (normalize('уоu').decoded !== 'you') throw new Error('CJS: normalize')
console.log('cjs ok')
`)
  const ts = `import { analyze, type Verdict } from 'content-guard'
const v: Verdict = analyze({ message: 'hi' })
const flagged: boolean = v.flagged
export { flagged }
`
  writeFileSync(join(app, 'types.mts'), ts)
  writeFileSync(join(app, 'types.cts'), ts)
  process.stdout.write(run('node', ['esm.mjs']))
  process.stdout.write(run('node', ['cjs.cjs']))
  const tsc = join(root, 'node_modules', 'typescript', 'bin', 'tsc')
  run('node', [tsc, '--ignoreConfig', '--noEmit', '--strict', '--module', 'nodenext', '--moduleResolution', 'nodenext', 'types.mts', 'types.cts'])
  console.log('types ok (ESM and CJS resolution)')
  let status = 0
  try {
    run('npm', ['exec', '--offline', '--', 'content-guard', 'y0u are an 1d10t'])
  } catch (error) {
    status = (error as { status: number }).status
  }
  if (status !== 1) throw new Error(`CLI: expected exit code 1, got ${status}`)
  console.log('cli ok')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
