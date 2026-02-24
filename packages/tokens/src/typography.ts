/**
 * Typography tokens for Tesserix Design System
 * Platform-agnostic font families, sizes, weights, and line heights
 */

// Font families
export const fontFamily = {
  sans: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans"',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ],
  serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ],
} as const

export type FontFamilyKey = keyof typeof fontFamily

// Font sizes (in px)
export const fontSize = {
  xs: 12,    // 0.75rem
  sm: 14,    // 0.875rem
  base: 16,  // 1rem
  lg: 18,    // 1.125rem
  xl: 20,    // 1.25rem
  '2xl': 24, // 1.5rem
  '3xl': 30, // 1.875rem
  '4xl': 36, // 2.25rem
  '5xl': 48, // 3rem
  '6xl': 60, // 3.75rem
  '7xl': 72, // 4.5rem
  '8xl': 96, // 6rem
  '9xl': 128, // 8rem
} as const

export type FontSizeKey = keyof typeof fontSize
export type FontSizeValue = (typeof fontSize)[FontSizeKey]

// Font weights
export const fontWeight = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const

export type FontWeightKey = keyof typeof fontWeight
export type FontWeightValue = (typeof fontWeight)[FontWeightKey]

// Line heights (relative to font size)
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
  3: 0.75,   // 12px
  4: 1,      // 16px
  5: 1.25,   // 20px
  6: 1.5,    // 24px
  7: 1.75,   // 28px
  8: 2,      // 32px
  9: 2.25,   // 36px
  10: 2.5,   // 40px
} as const

export type LineHeightKey = keyof typeof lineHeight
export type LineHeightValue = (typeof lineHeight)[LineHeightKey]

// Letter spacing (in em)
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const

export type LetterSpacingKey = keyof typeof letterSpacing
export type LetterSpacingValue = (typeof letterSpacing)[LetterSpacingKey]

// Typography scale presets
export interface TypographyPreset {
  fontSize: FontSizeValue
  lineHeight: number
  fontWeight: FontWeightValue
  letterSpacing?: number
}

export const typographyPresets = {
  h1: {
    fontSize: fontSize['4xl'],
    lineHeight: 1.2,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontSize: fontSize['3xl'],
    lineHeight: 1.3,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontSize: fontSize['2xl'],
    lineHeight: 1.4,
    fontWeight: fontWeight.semibold,
  },
  h4: {
    fontSize: fontSize.xl,
    lineHeight: 1.4,
    fontWeight: fontWeight.semibold,
  },
  h5: {
    fontSize: fontSize.lg,
    lineHeight: 1.5,
    fontWeight: fontWeight.medium,
  },
  h6: {
    fontSize: fontSize.base,
    lineHeight: 1.5,
    fontWeight: fontWeight.medium,
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: 1.5,
    fontWeight: fontWeight.normal,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    lineHeight: 1.5,
    fontWeight: fontWeight.normal,
  },
  caption: {
    fontSize: fontSize.xs,
    lineHeight: 1.4,
    fontWeight: fontWeight.normal,
  },
  button: {
    fontSize: fontSize.sm,
    lineHeight: 1,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  code: {
    fontSize: fontSize.sm,
    lineHeight: 1.6,
    fontWeight: fontWeight.normal,
  },
} as const

export type TypographyPresetKey = keyof typeof typographyPresets

/**
 * Convert font size to rem for web
 * @param size Font size in px
 * @returns Rem string
 */
export function fontSizeToRem(size: number): string {
  return `${size / 16}rem`
}

/**
 * Get font family string for web
 * @param family Font family key
 * @returns Font family string
 */
export function getFontFamily(family: FontFamilyKey): string {
  return fontFamily[family].join(', ')
}

/**
 * Get typography preset for platform
 * @param preset Preset key
 * @param platform Target platform ('web' | 'native')
 * @returns Typography style object
 */
export function getTypographyPreset(
  preset: TypographyPresetKey,
  platform: 'web' | 'native' = 'native'
): Record<string, string | number> {
  const style = typographyPresets[preset]

  if (platform === 'web') {
    const webStyle: Record<string, string | number> = {
      fontSize: fontSizeToRem(style.fontSize),
      lineHeight: style.lineHeight,
      fontWeight: style.fontWeight,
    }

    if ('letterSpacing' in style && style.letterSpacing !== undefined) {
      webStyle.letterSpacing = `${style.letterSpacing}em`
    }

    return webStyle
  }

  // React Native
  const nativeStyle: Record<string, string | number> = {
    fontSize: style.fontSize,
    lineHeight: style.fontSize * style.lineHeight,
    fontWeight: String(style.fontWeight),
  }

  if ('letterSpacing' in style && style.letterSpacing !== undefined) {
    nativeStyle.letterSpacing = style.letterSpacing * style.fontSize
  }

  return nativeStyle
}
