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

// Slate theme
export const slateColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '215 16% 47%',
    primaryForeground: '0 0% 100%',
    secondary: '210 11% 96%',
    secondaryForeground: '215 16% 25%',
    muted: '210 11% 97%',
    mutedForeground: '215 12% 42%',
    accent: '210 11% 96%',
    accentForeground: '215 16% 47%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '214 12% 90%',
    input: '214 12% 90%',
    ring: '215 16% 47%',
  },
  dark: {
    background: '217 33% 7%',
    foreground: '210 20% 98%',
    card: '215 28% 11%',
    cardForeground: '210 20% 98%',
    popover: '215 28% 11%',
    popoverForeground: '210 20% 98%',
    primary: '210 40% 70%',
    primaryForeground: '217 33% 7%',
    secondary: '215 25% 17%',
    secondaryForeground: '210 20% 98%',
    muted: '215 25% 17%',
    mutedForeground: '215 15% 65%',
    accent: '215 30% 22%',
    accentForeground: '210 20% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '217 33% 7%',
    border: '215 25% 20%',
    input: '215 25% 20%',
    ring: '210 40% 70%',
  },
}

// Zinc theme
export const zincColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '240 10% 4%',
    card: '0 0% 100%',
    cardForeground: '240 10% 4%',
    popover: '0 0% 100%',
    popoverForeground: '240 10% 4%',
    primary: '240 6% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '240 5% 96%',
    secondaryForeground: '240 6% 25%',
    muted: '240 5% 97%',
    mutedForeground: '240 4% 46%',
    accent: '240 5% 96%',
    accentForeground: '240 6% 50%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '240 6% 90%',
    input: '240 6% 90%',
    ring: '240 6% 50%',
  },
  dark: {
    background: '240 10% 4%',
    foreground: '0 0% 98%',
    card: '240 8% 8%',
    cardForeground: '0 0% 98%',
    popover: '240 8% 8%',
    popoverForeground: '0 0% 98%',
    primary: '240 6% 65%',
    primaryForeground: '240 10% 4%',
    secondary: '240 6% 15%',
    secondaryForeground: '0 0% 98%',
    muted: '240 6% 15%',
    mutedForeground: '240 5% 65%',
    accent: '240 6% 20%',
    accentForeground: '0 0% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '240 10% 4%',
    border: '240 6% 18%',
    input: '240 6% 18%',
    ring: '240 6% 65%',
  },
}

// Stone theme
export const stoneColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '20 14% 4%',
    card: '0 0% 100%',
    cardForeground: '20 14% 4%',
    popover: '0 0% 100%',
    popoverForeground: '20 14% 4%',
    primary: '25 6% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '30 5% 96%',
    secondaryForeground: '25 6% 22%',
    muted: '30 5% 97%',
    mutedForeground: '25 5% 45%',
    accent: '30 5% 96%',
    accentForeground: '25 6% 45%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '30 6% 90%',
    input: '30 6% 90%',
    ring: '25 6% 45%',
  },
  dark: {
    background: '20 14% 4%',
    foreground: '60 9% 98%',
    card: '24 10% 8%',
    cardForeground: '60 9% 98%',
    popover: '24 10% 8%',
    popoverForeground: '60 9% 98%',
    primary: '25 6% 60%',
    primaryForeground: '20 14% 4%',
    secondary: '24 6% 15%',
    secondaryForeground: '60 9% 98%',
    muted: '24 6% 15%',
    mutedForeground: '25 5% 64%',
    accent: '24 6% 20%',
    accentForeground: '60 9% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '20 14% 4%',
    border: '24 6% 18%',
    input: '24 6% 18%',
    ring: '25 6% 60%',
  },
}

// Indigo theme
export const indigoColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '239 84% 67%',
    primaryForeground: '0 0% 100%',
    secondary: '235 100% 98%',
    secondaryForeground: '239 60% 20%',
    muted: '235 100% 98%',
    mutedForeground: '239 10% 42%',
    accent: '235 100% 98%',
    accentForeground: '239 84% 67%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '234 35% 92%',
    input: '234 35% 92%',
    ring: '239 84% 67%',
  },
  dark: {
    background: '240 20% 8%',
    foreground: '235 85% 97%',
    card: '238 25% 12%',
    cardForeground: '235 85% 97%',
    popover: '238 25% 12%',
    popoverForeground: '235 85% 97%',
    primary: '239 84% 70%',
    primaryForeground: '240 20% 8%',
    secondary: '238 30% 18%',
    secondaryForeground: '235 85% 97%',
    muted: '238 30% 18%',
    mutedForeground: '235 20% 70%',
    accent: '238 40% 25%',
    accentForeground: '235 85% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '240 20% 8%',
    border: '238 30% 22%',
    input: '238 30% 22%',
    ring: '239 84% 70%',
  },
}

// Cyan (Sky) theme
export const cyanColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '199 89% 48%',
    primaryForeground: '0 0% 100%',
    secondary: '204 100% 97%',
    secondaryForeground: '199 65% 15%',
    muted: '204 100% 97%',
    mutedForeground: '199 10% 42%',
    accent: '204 100% 97%',
    accentForeground: '199 89% 48%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '202 40% 90%',
    input: '202 40% 90%',
    ring: '199 89% 48%',
  },
  dark: {
    background: '200 50% 6%',
    foreground: '204 90% 97%',
    card: '199 45% 10%',
    cardForeground: '204 90% 97%',
    popover: '199 45% 10%',
    popoverForeground: '204 90% 97%',
    primary: '199 89% 58%',
    primaryForeground: '200 50% 6%',
    secondary: '199 40% 18%',
    secondaryForeground: '204 90% 97%',
    muted: '199 40% 18%',
    mutedForeground: '202 20% 70%',
    accent: '199 55% 25%',
    accentForeground: '204 90% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '200 50% 6%',
    border: '199 35% 22%',
    input: '199 35% 22%',
    ring: '199 89% 58%',
  },
}

// Lime theme
export const limeColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '84 81% 44%',
    primaryForeground: '0 0% 100%',
    secondary: '90 95% 97%',
    secondaryForeground: '84 65% 15%',
    muted: '90 95% 97%',
    mutedForeground: '84 10% 40%',
    accent: '90 95% 97%',
    accentForeground: '84 81% 44%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '87 40% 88%',
    input: '87 40% 88%',
    ring: '84 81% 44%',
  },
  dark: {
    background: '85 50% 6%',
    foreground: '90 80% 97%',
    card: '84 45% 10%',
    cardForeground: '90 80% 97%',
    popover: '84 45% 10%',
    popoverForeground: '90 80% 97%',
    primary: '84 81% 54%',
    primaryForeground: '85 50% 6%',
    secondary: '84 40% 18%',
    secondaryForeground: '90 80% 97%',
    muted: '84 40% 18%',
    mutedForeground: '87 20% 68%',
    accent: '84 55% 25%',
    accentForeground: '90 80% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '85 50% 6%',
    border: '84 35% 22%',
    input: '84 35% 22%',
    ring: '84 81% 54%',
  },
}

// Orange theme
export const orangeColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '24 100% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '30 100% 96%',
    secondaryForeground: '20 75% 20%',
    muted: '30 100% 96%',
    mutedForeground: '24 15% 42%',
    accent: '30 100% 96%',
    accentForeground: '24 100% 50%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '27 40% 88%',
    input: '27 40% 88%',
    ring: '24 100% 50%',
  },
  dark: {
    background: '20 45% 8%',
    foreground: '30 95% 97%',
    card: '22 40% 12%',
    cardForeground: '30 95% 97%',
    popover: '22 40% 12%',
    popoverForeground: '30 95% 97%',
    primary: '24 100% 60%',
    primaryForeground: '20 45% 8%',
    secondary: '22 35% 18%',
    secondaryForeground: '30 95% 97%',
    muted: '22 35% 18%',
    mutedForeground: '27 20% 68%',
    accent: '22 50% 25%',
    accentForeground: '30 95% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '20 45% 8%',
    border: '22 35% 22%',
    input: '22 35% 22%',
    ring: '24 100% 60%',
  },
}

// Pink (Fuchsia) theme
export const pinkColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '328 86% 70%',
    primaryForeground: '0 0% 100%',
    secondary: '326 100% 98%',
    secondaryForeground: '328 60% 22%',
    muted: '326 100% 98%',
    mutedForeground: '328 10% 45%',
    accent: '326 100% 98%',
    accentForeground: '328 86% 70%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '325 35% 92%',
    input: '325 35% 92%',
    ring: '328 86% 70%',
  },
  dark: {
    background: '330 45% 9%',
    foreground: '326 85% 97%',
    card: '328 40% 13%',
    cardForeground: '326 85% 97%',
    popover: '328 40% 13%',
    popoverForeground: '326 85% 97%',
    primary: '328 86% 72%',
    primaryForeground: '330 45% 9%',
    secondary: '328 35% 19%',
    secondaryForeground: '326 85% 97%',
    muted: '328 35% 19%',
    mutedForeground: '325 20% 70%',
    accent: '328 50% 28%',
    accentForeground: '326 85% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '330 45% 9%',
    border: '328 35% 23%',
    input: '328 35% 23%',
    ring: '328 86% 72%',
  },
}

// Crimson theme
export const crimsonColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '348 83% 47%',
    primaryForeground: '0 0% 100%',
    secondary: '350 100% 97%',
    secondaryForeground: '348 65% 18%',
    muted: '350 100% 97%',
    mutedForeground: '348 10% 42%',
    accent: '350 100% 97%',
    accentForeground: '348 83% 47%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '347 35% 90%',
    input: '347 35% 90%',
    ring: '348 83% 47%',
  },
  dark: {
    background: '348 50% 7%',
    foreground: '350 85% 97%',
    card: '348 45% 11%',
    cardForeground: '350 85% 97%',
    popover: '348 45% 11%',
    popoverForeground: '350 85% 97%',
    primary: '348 83% 60%',
    primaryForeground: '348 50% 7%',
    secondary: '348 40% 17%',
    secondaryForeground: '350 85% 97%',
    muted: '348 40% 17%',
    mutedForeground: '347 20% 68%',
    accent: '348 55% 24%',
    accentForeground: '350 85% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '348 50% 7%',
    border: '348 40% 20%',
    input: '348 40% 20%',
    ring: '348 83% 60%',
  },
}

// Forest theme
export const forestColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '142 76% 36%',
    primaryForeground: '0 0% 100%',
    secondary: '145 85% 97%',
    secondaryForeground: '142 60% 14%',
    muted: '145 85% 97%',
    mutedForeground: '142 10% 38%',
    accent: '145 85% 97%',
    accentForeground: '142 76% 36%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '144 40% 88%',
    input: '144 40% 88%',
    ring: '142 76% 36%',
  },
  dark: {
    background: '142 55% 5%',
    foreground: '145 70% 97%',
    card: '142 50% 9%',
    cardForeground: '145 70% 97%',
    popover: '142 50% 9%',
    popoverForeground: '145 70% 97%',
    primary: '142 76% 48%',
    primaryForeground: '142 55% 5%',
    secondary: '142 45% 15%',
    secondaryForeground: '145 70% 97%',
    muted: '142 45% 15%',
    mutedForeground: '144 20% 68%',
    accent: '142 55% 22%',
    accentForeground: '145 70% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '142 55% 5%',
    border: '142 45% 18%',
    input: '142 45% 18%',
    ring: '142 76% 48%',
  },
}

// Ocean theme
export const oceanColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '207 90% 54%',
    primaryForeground: '0 0% 100%',
    secondary: '210 100% 97%',
    secondaryForeground: '207 70% 18%',
    muted: '210 100% 97%',
    mutedForeground: '207 12% 42%',
    accent: '210 100% 97%',
    accentForeground: '207 90% 54%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '209 35% 90%',
    input: '209 35% 90%',
    ring: '207 90% 54%',
  },
  dark: {
    background: '208 65% 6%',
    foreground: '210 85% 97%',
    card: '207 60% 10%',
    cardForeground: '210 85% 97%',
    popover: '207 60% 10%',
    popoverForeground: '210 85% 97%',
    primary: '207 90% 61%',
    primaryForeground: '208 65% 6%',
    secondary: '207 50% 16%',
    secondaryForeground: '210 85% 97%',
    muted: '207 50% 16%',
    mutedForeground: '209 20% 68%',
    accent: '207 60% 23%',
    accentForeground: '210 85% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '208 65% 6%',
    border: '207 50% 19%',
    input: '207 50% 19%',
    ring: '207 90% 61%',
  },
}

// Sunset theme
export const sunsetColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '14 100% 57%',
    primaryForeground: '0 0% 100%',
    secondary: '20 100% 97%',
    secondaryForeground: '14 80% 20%',
    muted: '20 100% 97%',
    mutedForeground: '14 15% 42%',
    accent: '20 100% 97%',
    accentForeground: '14 100% 57%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '17 40% 90%',
    input: '17 40% 90%',
    ring: '14 100% 57%',
  },
  dark: {
    background: '15 50% 7%',
    foreground: '20 90% 97%',
    card: '14 45% 11%',
    cardForeground: '20 90% 97%',
    popover: '14 45% 11%',
    popoverForeground: '20 90% 97%',
    primary: '14 100% 64%',
    primaryForeground: '15 50% 7%',
    secondary: '14 40% 17%',
    secondaryForeground: '20 90% 97%',
    muted: '14 40% 17%',
    mutedForeground: '17 20% 68%',
    accent: '14 55% 24%',
    accentForeground: '20 90% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '15 50% 7%',
    border: '14 40% 20%',
    input: '14 40% 20%',
    ring: '14 100% 64%',
  },
}

// Lavender theme
export const lavenderColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '275 70% 72%',
    primaryForeground: '0 0% 100%',
    secondary: '280 100% 98%',
    secondaryForeground: '275 50% 25%',
    muted: '280 100% 98%',
    mutedForeground: '275 10% 45%',
    accent: '280 100% 98%',
    accentForeground: '275 70% 72%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '277 35% 93%',
    input: '277 35% 93%',
    ring: '275 70% 72%',
  },
  dark: {
    background: '275 45% 10%',
    foreground: '280 80% 98%',
    card: '275 40% 14%',
    cardForeground: '280 80% 98%',
    popover: '275 40% 14%',
    popoverForeground: '280 80% 98%',
    primary: '275 70% 75%',
    primaryForeground: '275 45% 10%',
    secondary: '275 35% 20%',
    secondaryForeground: '280 80% 98%',
    muted: '275 35% 20%',
    mutedForeground: '277 20% 70%',
    accent: '275 45% 27%',
    accentForeground: '280 80% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '275 45% 10%',
    border: '275 35% 24%',
    input: '275 35% 24%',
    ring: '275 70% 75%',
  },
}

// Neon theme
export const neonColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '158 94% 51%',
    primaryForeground: '0 0% 0%',
    secondary: '160 100% 97%',
    secondaryForeground: '158 80% 18%',
    muted: '160 100% 97%',
    mutedForeground: '158 12% 40%',
    accent: '160 100% 97%',
    accentForeground: '158 94% 51%',
    destructive: '330 100% 55%',
    destructiveForeground: '0 0% 0%',
    border: '159 35% 88%',
    input: '159 35% 88%',
    ring: '158 94% 51%',
  },
  dark: {
    background: '0 0% 8%',
    foreground: '0 0% 98%',
    card: '0 0% 12%',
    cardForeground: '0 0% 98%',
    popover: '0 0% 12%',
    popoverForeground: '0 0% 98%',
    primary: '158 94% 55%',
    primaryForeground: '0 0% 0%',
    secondary: '0 0% 18%',
    secondaryForeground: '0 0% 98%',
    muted: '0 0% 18%',
    mutedForeground: '0 0% 68%',
    accent: '158 100% 35%',
    accentForeground: '0 0% 98%',
    destructive: '330 100% 60%',
    destructiveForeground: '0 0% 0%',
    border: '0 0% 22%',
    input: '0 0% 22%',
    ring: '158 94% 55%',
  },
}

// Midnight theme
export const midnightColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '222 47% 11%',
    card: '0 0% 100%',
    cardForeground: '222 47% 11%',
    popover: '0 0% 100%',
    popoverForeground: '222 47% 11%',
    primary: '230 35% 28%',
    primaryForeground: '0 0% 100%',
    secondary: '228 15% 96%',
    secondaryForeground: '230 25% 18%',
    muted: '228 15% 97%',
    mutedForeground: '230 10% 38%',
    accent: '228 15% 96%',
    accentForeground: '230 35% 28%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '229 15% 90%',
    input: '229 15% 90%',
    ring: '230 35% 28%',
  },
  dark: {
    background: '231 45% 6%',
    foreground: '228 20% 98%',
    card: '230 40% 10%',
    cardForeground: '228 20% 98%',
    popover: '230 40% 10%',
    popoverForeground: '228 20% 98%',
    primary: '230 35% 45%',
    primaryForeground: '0 0% 100%',
    secondary: '230 30% 15%',
    secondaryForeground: '228 20% 98%',
    muted: '230 30% 15%',
    mutedForeground: '229 15% 65%',
    accent: '230 35% 20%',
    accentForeground: '228 20% 98%',
    destructive: '0 62% 64%',
    destructiveForeground: '231 45% 6%',
    border: '230 30% 18%',
    input: '230 30% 18%',
    ring: '230 35% 45%',
  },
}

// Mocha theme
export const mochaColors: ThemeColors = {
  light: {
    background: '0 0% 100%',
    foreground: '30 25% 11%',
    card: '0 0% 100%',
    cardForeground: '30 25% 11%',
    popover: '0 0% 100%',
    popoverForeground: '30 25% 11%',
    primary: '28 45% 42%',
    primaryForeground: '0 0% 100%',
    secondary: '35 20% 96%',
    secondaryForeground: '28 35% 20%',
    muted: '35 20% 97%',
    mutedForeground: '28 15% 40%',
    accent: '35 20% 96%',
    accentForeground: '28 45% 42%',
    destructive: '0 73% 51%',
    destructiveForeground: '0 0% 100%',
    border: '32 20% 90%',
    input: '32 20% 90%',
    ring: '28 45% 42%',
  },
  dark: {
    background: '28 30% 8%',
    foreground: '35 25% 97%',
    card: '28 28% 12%',
    cardForeground: '35 25% 97%',
    popover: '28 28% 12%',
    popoverForeground: '35 25% 97%',
    primary: '28 45% 55%',
    primaryForeground: '28 30% 8%',
    secondary: '28 25% 17%',
    secondaryForeground: '35 25% 97%',
    muted: '28 25% 17%',
    mutedForeground: '32 18% 66%',
    accent: '28 35% 23%',
    accentForeground: '35 25% 97%',
    destructive: '0 62% 64%',
    destructiveForeground: '28 30% 8%',
    border: '28 25% 20%',
    input: '28 25% 20%',
    ring: '28 45% 55%',
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
  slate: slateColors,
  zinc: zincColors,
  stone: stoneColors,
  indigo: indigoColors,
  cyan: cyanColors,
  lime: limeColors,
  orange: orangeColors,
  pink: pinkColors,
  crimson: crimsonColors,
  forest: forestColors,
  ocean: oceanColors,
  sunset: sunsetColors,
  lavender: lavenderColors,
  neon: neonColors,
  midnight: midnightColors,
  mocha: mochaColors,
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
