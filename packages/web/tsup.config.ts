import { defineConfig } from 'tsup'
import { copyFileSync, mkdirSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'tailwindcss'],
  outDir: 'dist',
  banner: {
    js: '"use client";',
  },
  async onSuccess() {
    // Copy theme files to dist/themes
    const themesDir = join('dist', 'themes')
    mkdirSync(themesDir, { recursive: true })

    copyFileSync('src/themes/default.css', join(themesDir, 'default.css'))
    copyFileSync('src/themes/emerald.css', join(themesDir, 'emerald.css'))
    copyFileSync('src/themes/sapphire.css', join(themesDir, 'sapphire.css'))
    copyFileSync('src/themes/rose.css', join(themesDir, 'rose.css'))
    copyFileSync('src/themes/amber.css', join(themesDir, 'amber.css'))
    copyFileSync('src/themes/violet.css', join(themesDir, 'violet.css'))
    copyFileSync('src/themes/teal.css', join(themesDir, 'teal.css'))

    console.log('✓ Theme files copied to dist/themes')
  },
})
