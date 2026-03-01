/**
 * One-time migration script: Convert HSL color values to OKLCH
 *
 * Reads themes.json, converts all HSL values ("H S% L%") to OKLCH ("oklch(L C H)"),
 * writes updated themes.json, and generates updated colors.ts.
 *
 * Color math: HSL → sRGB → linear RGB → OKLab → OKLCH
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// --- Color conversion math ---

function hslToSrgb(h, s, l) {
  // h: 0-360, s: 0-100, l: 0-100 → r,g,b: 0-1
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h >= 0 && h < 60)        { r = c; g = x; b = 0 }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0 }
  else if (h >= 120 && h < 180){ r = 0; g = c; b = x }
  else if (h >= 180 && h < 240){ r = 0; g = x; b = c }
  else if (h >= 240 && h < 300){ r = x; g = 0; b = c }
  else if (h >= 300 && h < 360){ r = c; g = 0; b = x }
  return [r + m, g + m, b + m]
}

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToOklab(r, g, b) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2220049941 * g + 0.6396925440 * b
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)
  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ]
}

function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a * a + b * b)
  let H = Math.atan2(b, a) * (180 / Math.PI)
  if (H < 0) H += 360
  return [L, C, H]
}

function hslStringToOklch(hslStr) {
  const parts = hslStr.split(' ')
  const h = parseFloat(parts[0])
  const s = parseFloat(parts[1])
  const l = parseFloat(parts[2])

  // Achromatic: HSL saturation is 0 → pure gray, skip matrix (avoids precision artifacts)
  if (s === 0) {
    const v = l / 100
    const vLinear = srgbToLinear(v)
    // For grays, OKLab L ≈ cbrt(linear), clamp to [0,1]
    const okL = Math.min(1, Math.max(0, Math.cbrt(vLinear)))
    return `oklch(${round(okL, 4)} 0 0)`
  }

  const [sr, sg, sb] = hslToSrgb(h, s, l)
  const lr = srgbToLinear(sr)
  const lg = srgbToLinear(sg)
  const lb = srgbToLinear(sb)
  const [L, a, b] = linearToOklab(lr, lg, lb)
  const [oL, oC, oH] = oklabToOklch(L, a, b)

  // Round: L to 4 decimals, C to 4 decimals, H to 2 decimals
  // Clamp L to [0,1] for edge cases
  const rL = round(Math.min(1, Math.max(0, oL)), 4)
  const rC = round(oC, 4)
  const rH = round(oH, 2)

  return `oklch(${rL} ${rC} ${rH})`
}

function round(num, decimals) {
  const factor = Math.pow(10, decimals)
  return Math.round(num * factor) / factor
}

// --- Convert themes.json ---

const themesJsonPath = join(__dirname, '..', 'packages', 'web', 'src', 'tokens', 'themes.json')
const colorsPath = join(__dirname, '..', 'packages', 'tokens', 'src', 'colors.ts')

const input = JSON.parse(readFileSync(themesJsonPath, 'utf8'))
const tokens = input.tokens

let conversionCount = 0

for (const [themeName, config] of Object.entries(input.themes)) {
  for (const mode of ['light', 'dark']) {
    if (!config[mode]) continue
    for (const token of tokens) {
      if (config[mode][token]) {
        const oldVal = config[mode][token]
        const newVal = hslStringToOklch(oldVal)
        config[mode][token] = newVal
        conversionCount++
      }
    }
  }
}

writeFileSync(themesJsonPath, JSON.stringify(input, null, 2) + '\n')
console.log(`Converted ${conversionCount} color values in themes.json`)

// --- Generate colors.ts ---

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function generateThemeBlock(varName, comment, config) {
  const lines = []
  lines.push(`// ${comment}`)
  lines.push(`export const ${varName}: ThemeColors = {`)
  for (const mode of ['light', 'dark']) {
    lines.push(`  ${mode}: {`)
    for (const token of tokens) {
      const camelToken = kebabToCamel(token)
      const val = config[mode][token]
      const isLast = token === tokens[tokens.length - 1]
      lines.push(`    ${camelToken}: '${val}',`)
    }
    lines.push(`  },`)
  }
  lines.push(`}`)
  return lines.join('\n')
}

const themeNameMap = {
  default: { varName: 'defaultColors', comment: 'Default theme colors' },
  emerald: { varName: 'emeraldColors', comment: 'Emerald theme' },
  sapphire: { varName: 'sapphireColors', comment: 'Sapphire theme' },
  rose: { varName: 'roseColors', comment: 'Rose theme' },
  amber: { varName: 'amberColors', comment: 'Amber theme' },
  violet: { varName: 'violetColors', comment: 'Violet theme' },
  teal: { varName: 'tealColors', comment: 'Teal theme' },
  slate: { varName: 'slateColors', comment: 'Slate theme' },
  zinc: { varName: 'zincColors', comment: 'Zinc theme' },
  stone: { varName: 'stoneColors', comment: 'Stone theme' },
  indigo: { varName: 'indigoColors', comment: 'Indigo theme' },
  cyan: { varName: 'cyanColors', comment: 'Cyan (Sky) theme' },
  lime: { varName: 'limeColors', comment: 'Lime theme' },
  orange: { varName: 'orangeColors', comment: 'Orange theme' },
  pink: { varName: 'pinkColors', comment: 'Pink (Fuchsia) theme' },
  crimson: { varName: 'crimsonColors', comment: 'Crimson theme' },
  forest: { varName: 'forestColors', comment: 'Forest theme' },
  ocean: { varName: 'oceanColors', comment: 'Ocean theme' },
  sunset: { varName: 'sunsetColors', comment: 'Sunset theme' },
  lavender: { varName: 'lavenderColors', comment: 'Lavender theme' },
  neon: { varName: 'neonColors', comment: 'Neon theme' },
  midnight: { varName: 'midnightColors', comment: 'Midnight theme' },
  mocha: { varName: 'mochaColors', comment: 'Mocha theme' },
}

const themeBlocks = Object.entries(input.themes)
  .map(([name, config]) => {
    const { varName, comment } = themeNameMap[name]
    return generateThemeBlock(varName, comment, config)
  })
  .join('\n\n')

const themesMapEntries = Object.entries(themeNameMap)
  .map(([key, { varName }]) => `  ${key}: ${varName},`)
  .join('\n')

const colorsTs = `/**
 * Color tokens for Tesserix Design System
 * Values are in OKLCH format (oklch(L C H)) for perceptually uniform color handling
 * Convert to rgba for React Native using provided utilities
 */

export type ColorMode = 'light' | 'dark'

export interface ColorTokens {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export interface ThemeColors {
  light: ColorTokens
  dark: ColorTokens
}

${themeBlocks}

// All available themes
export const themes = {
${themesMapEntries}
} as const

export type ThemeName = keyof typeof themes

/**
 * Utility to add alpha to an OKLCH color string
 * @param oklch OKLCH string (e.g., "oklch(0.32 0.03 253)")
 * @param alpha Alpha value (0-1)
 * @returns OKLCH string with alpha for web
 */
export function oklchWithAlpha(oklch: string, alpha: number = 1): string {
  // "oklch(L C H)" → "oklch(L C H / alpha)"
  return oklch.replace(')', \` / \${alpha})\`)
}

/**
 * Utility to convert OKLCH string to RGB values
 * @param oklch OKLCH string (e.g., "oklch(0.32 0.03 253)")
 * @returns RGB object {r, g, b} with values 0-255
 */
export function oklchToRgb(oklch: string): { r: number; g: number; b: number } {
  // Parse "oklch(L C H)"
  const match = oklch.match(/oklch\\(([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\)/)
  if (!match) throw new Error(\`Invalid OKLCH string: \${oklch}\`)
  const L = parseFloat(match[1])
  const C = parseFloat(match[2])
  const H = parseFloat(match[3])

  // OKLCH → OKLab
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const b = C * Math.sin(hRad)

  // OKLab → linear RGB via LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

  // Linear RGB → sRGB
  const toSrgb = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055

  return {
    r: Math.round(Math.min(1, Math.max(0, toSrgb(lr))) * 255),
    g: Math.round(Math.min(1, Math.max(0, toSrgb(lg))) * 255),
    b: Math.round(Math.min(1, Math.max(0, toSrgb(lb))) * 255),
  }
}

/**
 * Utility to convert OKLCH string to RGBA for React Native
 * @param oklch OKLCH string (e.g., "oklch(0.32 0.03 253)")
 * @param alpha Alpha value (0-1)
 * @returns RGBA string
 */
export function oklchToRgba(oklch: string, alpha: number = 1): string {
  const { r, g, b } = oklchToRgb(oklch)
  return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`
}

/**
 * Get colors for a specific theme and mode
 * @param theme Theme name
 * @param mode Color mode (light or dark)
 * @returns Color tokens for the theme
 */
export function getThemeColors(theme: ThemeName = 'default', mode: ColorMode = 'light'): ColorTokens {
  return themes[theme][mode]
}
`

writeFileSync(colorsPath, colorsTs)
console.log(`Generated ${colorsPath}`)
