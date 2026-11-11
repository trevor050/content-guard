import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    platform: 'neutral',
    target: 'es2022',
    dts: true,
    clean: true,
    sourcemap: false,
  },
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    platform: 'node',
    target: 'node22',
    dts: false,
    clean: false,
  },
])
