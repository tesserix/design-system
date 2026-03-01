import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const tokensPath = join(rootDir, 'src', 'tokens', 'themes.json')
const themesDir = join(rootDir, 'src', 'themes')

const input = JSON.parse(readFileSync(tokensPath, 'utf8'))
const tokens = input.tokens
const themes = input.themes

const cssThemeInline = [
  '@theme inline {',
  ...tokens.map((token) => `  --color-${token}: var(--${token});`),
  '}',
  '',
].join('\n')

const serializeVars = (values, radius) => {
  const lines = tokens.map((token) => `  --${token}: ${values[token]};`)
  if (radius) {
    lines.push(`  --radius: ${radius};`)
  }
  return lines.join('\n')
}

const buildThemeCss = (themeName, config) => {
  const lines = []
  if (themeName === 'default') {
    lines.push('@import "tailwindcss";', '')
  }

  lines.push(cssThemeInline)

  lines.push(
    `:root[data-theme="${themeName}"],`,
    `[data-theme="${themeName}"].light,`,
    `[data-theme="${themeName}"]:not(.dark):not(.light) {`,
    serializeVars(config.light, config.radius),
    '}',
    '',
    `:root[data-theme="${themeName}"].dark,`,
    `[data-theme="${themeName}"].dark {`,
    serializeVars(config.dark),
    '}',
    ''
  )

  if (config.includeBaseStyles) {
    lines.push(
      '* {',
      '  border-color: var(--border);',
      '}',
      '',
      'body {',
      '  background-color: var(--background);',
      '  color: var(--foreground);',
      '}',
      ''
    )
  }

  return lines.join('\n')
}

mkdirSync(themesDir, { recursive: true })

for (const [themeName, config] of Object.entries(themes)) {
  const css = buildThemeCss(themeName, config)
  writeFileSync(join(themesDir, `${themeName}.css`), css)
}

console.log(`Generated ${Object.keys(themes).length} theme CSS files from ${tokensPath}`)
