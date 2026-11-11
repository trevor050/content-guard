/**
 * Reports the real cost of the package: minified/gzipped bundle and npm tarball.
 *
 *   npm run size
 */
import { brotliCompressSync, gzipSync } from 'node:zlib'
import { build } from 'rolldown'
import { runNpm } from './npm.ts'

const result = await build({ input: 'src/index.ts', platform: 'neutral', write: false, output: { format: 'esm', minify: true } })
const code = Buffer.from(result.output[0].code)
const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} kB`
console.log(`bundle (ESM, minified): ${kb(code.length)}, gzip ${kb(gzipSync(code, { level: 9 }).length)}, brotli ${kb(brotliCompressSync(code).length)}`)

const [pack] = JSON.parse(runNpm(['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' })) as Array<{
  size: number
  unpackedSize: number
  entryCount: number
}>
console.log(`npm tarball: ${kb(pack!.size)} packed, ${kb(pack!.unpackedSize)} unpacked, ${pack!.entryCount} files, 0 runtime dependencies`)
