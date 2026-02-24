/**
 * Color tokens for Tesserix Design System
 * Values are in HSL format (hue saturation% lightness%) for web compatibility
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

// Default theme colors
export const defaultColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '215 25% 27%',
    primaryForeground: '0 0% 100%',
    secondary: '210 20% 96%',
    secondaryForeground: '217 19% 27%',
    muted: '210 20% 98%',
    mutedForeground: '217 12% 33%',
    accent: '210 20% 96%',
    accentForeground: '222 47% 11%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '220 13% 91%',
    input: '220 13% 91%',
    ring: '215 25% 27%',
  },
  dark: {
    background: '243 50% 11%',
    foreground: '210 20% 98%',
    card: '240 30% 14%',
    cardForeground: '210 20% 98%',
    popover: '240 30% 14%',
    popoverForeground: '210 20% 98%',
    primary: '239 84% 76%',
    primaryForeground: '243 50% 11%',
    secondary: '243 60% 20%',
    secondaryForeground: '225 71% 91%',
    muted: '243 60% 20%',
    mutedForeground: '215 20% 65%',
    accent: '243 75% 28%',
    accentForeground: '225 71% 91%',
    destructive: '0 62% 64%',
    destructiveForeground: '243 50% 11%',
    border: '243 48% 35%',
    input: '243 48% 35%',
    ring: '239 84% 76%',
  },
}

// Emerald theme
export const emeraldColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '160 84% 39%',
    primaryForeground: '0 0% 100%',
    secondary: '138 76% 97%',
    secondaryForeground: '160 60% 15%',
    muted: '138 76% 97%',
    mutedForeground: '160 10% 40%',
    accent: '138 76% 97%',
    accentForeground: '160 84% 39%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '143 47% 88%',
    input: '143 47% 88%',
    ring: '160 84% 39%',
  },
  dark: {
    background: '160 50% 5%',
    foreground: '144 61% 97%',
    card: '160 40% 8%',
    cardForeground: '144 61% 97%',
    popover: '160 40% 8%',
    popoverForeground: '144 61% 97%',
    primary: '160 84% 52%',
    primaryForeground: '160 50% 5%',
    secondary: '160 35% 15%',
    secondaryForeground: '144 61% 97%',
    muted: '160 35% 15%',
    mutedForeground: '144 20% 70%',
    accent: '160 45% 22%',
    accentForeground: '144 61% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '160 50% 5%',
    border: '160 30% 20%',
    input: '160 30% 20%',
    ring: '160 84% 52%',
  },
}

// Sapphire theme
export const sapphireColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '221 83% 53%',
    primaryForeground: '0 0% 100%',
    secondary: '214 95% 97%',
    secondaryForeground: '221 50% 17%',
    muted: '214 95% 97%',
    mutedForeground: '215 16% 47%',
    accent: '214 95% 97%',
    accentForeground: '221 83% 53%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '214 32% 91%',
    input: '214 32% 91%',
    ring: '221 83% 53%',
  },
  dark: {
    background: '222 47% 7%',
    foreground: '210 40% 98%',
    card: '217 33% 11%',
    cardForeground: '210 40% 98%',
    popover: '217 33% 11%',
    popoverForeground: '210 40% 98%',
    primary: '217 91% 60%',
    primaryForeground: '222 47% 7%',
    secondary: '217 33% 17%',
    secondaryForeground: '210 40% 98%',
    muted: '217 33% 17%',
    mutedForeground: '215 20% 65%',
    accent: '224 76% 48%',
    accentForeground: '210 40% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '222 47% 7%',
    border: '217 33% 22%',
    input: '217 33% 22%',
    ring: '217 91% 60%',
  },
}

// Rose theme
export const roseColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '346 77% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '350 100% 97%',
    secondaryForeground: '346 60% 20%',
    muted: '350 100% 97%',
    mutedForeground: '346 10% 45%',
    accent: '350 100% 97%',
    accentForeground: '346 77% 50%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '340 30% 90%',
    input: '340 30% 90%',
    ring: '346 77% 50%',
  },
  dark: {
    background: '346 40% 8%',
    foreground: '340 75% 97%',
    card: '346 35% 12%',
    cardForeground: '340 75% 97%',
    popover: '346 35% 12%',
    popoverForeground: '340 75% 97%',
    primary: '346 77% 62%',
    primaryForeground: '346 40% 8%',
    secondary: '346 30% 18%',
    secondaryForeground: '340 75% 97%',
    muted: '346 30% 18%',
    mutedForeground: '340 20% 70%',
    accent: '346 50% 25%',
    accentForeground: '340 75% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '346 40% 8%',
    border: '346 25% 22%',
    input: '346 25% 22%',
    ring: '346 77% 62%',
  },
}

// Amber theme
export const amberColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '32 95% 44%',
    primaryForeground: '0 0% 100%',
    secondary: '48 100% 96%',
    secondaryForeground: '25 65% 20%',
    muted: '48 100% 96%',
    mutedForeground: '32 15% 42%',
    accent: '48 100% 96%',
    accentForeground: '32 95% 44%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '40 40% 88%',
    input: '40 40% 88%',
    ring: '32 95% 44%',
  },
  dark: {
    background: '25 40% 8%',
    foreground: '48 90% 97%',
    card: '28 35% 12%',
    cardForeground: '48 90% 97%',
    popover: '28 35% 12%',
    popoverForeground: '48 90% 97%',
    primary: '38 92% 58%',
    primaryForeground: '25 40% 8%',
    secondary: '32 35% 18%',
    secondaryForeground: '48 90% 97%',
    muted: '32 35% 18%',
    mutedForeground: '40 20% 68%',
    accent: '35 55% 25%',
    accentForeground: '48 90% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '25 40% 8%',
    border: '30 25% 22%',
    input: '30 25% 22%',
    ring: '38 92% 58%',
  },
}

// Violet theme
export const violetColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '262 83% 58%',
    primaryForeground: '0 0% 100%',
    secondary: '270 100% 98%',
    secondaryForeground: '262 55% 20%',
    muted: '270 100% 98%',
    mutedForeground: '262 12% 42%',
    accent: '270 100% 98%',
    accentForeground: '262 83% 58%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '265 35% 90%',
    input: '265 35% 90%',
    ring: '262 83% 58%',
  },
  dark: {
    background: '262 45% 9%',
    foreground: '270 80% 98%',
    card: '262 38% 13%',
    cardForeground: '270 80% 98%',
    popover: '262 38% 13%',
    popoverForeground: '270 80% 98%',
    primary: '265 89% 68%',
    primaryForeground: '262 45% 9%',
    secondary: '262 35% 19%',
    secondaryForeground: '270 80% 98%',
    muted: '262 35% 19%',
    mutedForeground: '265 20% 68%',
    accent: '262 50% 28%',
    accentForeground: '270 80% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '262 45% 9%',
    border: '262 30% 23%',
    input: '262 30% 23%',
    ring: '265 89% 68%',
  },
}

// Teal theme
export const tealColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '173 80% 40%',
    primaryForeground: '0 0% 100%',
    secondary: '180 100% 97%',
    secondaryForeground: '173 65% 15%',
    muted: '180 100% 97%',
    mutedForeground: '173 15% 40%',
    accent: '180 100% 97%',
    accentForeground: '173 80% 40%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '177 40% 88%',
    input: '177 40% 88%',
    ring: '173 80% 40%',
  },
  dark: {
    background: '173 50% 6%',
    foreground: '180 80% 97%',
    card: '173 45% 10%',
    cardForeground: '180 80% 97%',
    popover: '173 45% 10%',
    popoverForeground: '180 80% 97%',
    primary: '173 85% 55%',
    primaryForeground: '173 50% 6%',
    secondary: '173 40% 18%',
    secondaryForeground: '180 80% 97%',
    muted: '173 40% 18%',
    mutedForeground: '177 20% 68%',
    accent: '173 55% 25%',
    accentForeground: '180 80% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '173 50% 6%',
    border: '173 35% 22%',
    input: '173 35% 22%',
    ring: '173 85% 55%',
  },
}

// All available themes
export const themes = {
  default: defaultColors,
  emerald: emeraldColors,
  sapphire: sapphireColors,
  rose: roseColors,
  amber: amberColors,
  violet: violetColors,
  teal: tealColors,
} as const

export type ThemeName = keyof typeof themes

/**
 * Utility to convert HSL string to HSLA with alpha
 * @param hsl HSL string (e.g., "215 25% 27%")
 * @param alpha Alpha value (0-1)
 * @returns HSLA string for web
 */
export function hslToHsla(hsl: string, alpha: number = 1): string {
  return `hsla(${hsl.replace(' ', ', ').replace(' ', ', ')}, ${alpha})`
}

/**
 * Utility to convert HSL string to RGB values
 * @param hsl HSL string (e.g., "215 25% 27%")
 * @returns RGB object {r, g, b}
 */
export function hslToRgb(hsl: string): { r: number; g: number; b: number } {
  const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v))
  const sNorm = s / 100
  const lNorm = l / 100

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2

  let r = 0,
    g = 0,
    b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

/**
 * Utility to convert HSL string to RGBA for React Native
 * @param hsl HSL string (e.g., "215 25% 27%")
 * @param alpha Alpha value (0-1)
 * @returns RGBA string
 */
export function hslToRgba(hsl: string, alpha: number = 1): string {
  const { r, g, b } = hslToRgb(hsl)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
