/**
 * Spacing tokens for Tesserix Design System
 * Based on a 4px base unit scale (0.25rem = 4px)
 * Compatible with both web (rem) and React Native (number)
 */

export const spacing = {
  0: 0,
  0.5: 2,    // 0.125rem = 2px
  1: 4,      // 0.25rem = 4px
  1.5: 6,    // 0.375rem = 6px
  2: 8,      // 0.5rem = 8px
  2.5: 10,   // 0.625rem = 10px
  3: 12,     // 0.75rem = 12px
  3.5: 14,   // 0.875rem = 14px
  4: 16,     // 1rem = 16px
  5: 20,     // 1.25rem = 20px
  6: 24,     // 1.5rem = 24px
  7: 28,     // 1.75rem = 28px
  8: 32,     // 2rem = 32px
  9: 36,     // 2.25rem = 36px
  10: 40,    // 2.5rem = 40px
  11: 44,    // 2.75rem = 44px
  12: 48,    // 3rem = 48px
  14: 56,    // 3.5rem = 56px
  16: 64,    // 4rem = 64px
  20: 80,    // 5rem = 80px
  24: 96,    // 6rem = 96px
  28: 112,   // 7rem = 112px
  32: 128,   // 8rem = 128px
  36: 144,   // 9rem = 144px
  40: 160,   // 10rem = 160px
  44: 176,   // 11rem = 176px
  48: 192,   // 12rem = 192px
  52: 208,   // 13rem = 208px
  56: 224,   // 14rem = 224px
  60: 240,   // 15rem = 240px
  64: 256,   // 16rem = 256px
  72: 288,   // 18rem = 288px
  80: 320,   // 20rem = 320px
  96: 384,   // 24rem = 384px
} as const

export type SpacingKey = keyof typeof spacing
export type SpacingValue = (typeof spacing)[SpacingKey]

/**
 * Convert spacing value to rem for web
 * @param value Spacing value in px
 * @returns Rem string
 */
export function toRem(value: number): string {
  return `${value / 16}rem`
}

/**
 * Convert spacing key to rem for web
 * @param key Spacing key
 * @returns Rem string
 */
export function spacingToRem(key: SpacingKey): string {
  return toRem(spacing[key])
}

/**
 * Get spacing value in pixels
 * @param key Spacing key
 * @returns Pixel value (number for React Native, px string for web)
 */
export function getSpacing(key: SpacingKey, format: 'number' | 'px' | 'rem' = 'number'): string | number {
  const value = spacing[key]

  if (format === 'number') {
    return value
  }

  if (format === 'px') {
    return `${value}px`
  }

  return toRem(value)
}

// Semantic spacing aliases for common use cases
export const semanticSpacing = {
  none: spacing[0],
  xs: spacing[1],      // 4px
  sm: spacing[2],      // 8px
  md: spacing[4],      // 16px
  lg: spacing[6],      // 24px
  xl: spacing[8],      // 32px
  '2xl': spacing[12],  // 48px
  '3xl': spacing[16],  // 64px
  '4xl': spacing[24],  // 96px
  '5xl': spacing[32],  // 128px
  '6xl': spacing[40],  // 160px
  '7xl': spacing[48],  // 192px
  '8xl': spacing[56],  // 224px
  '9xl': spacing[64],  // 256px
} as const

export type SemanticSpacingKey = keyof typeof semanticSpacing
