import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/colors.ts',
    'src/spacing.ts',
    'src/typography.ts',
    'src/radius.ts',
    'src/shadows.ts',
    'src/breakpoints.ts',
    'src/z-index.ts',
    'src/animations.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
})
