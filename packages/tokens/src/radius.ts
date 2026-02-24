/**
 * Border radius tokens for Tesserix Design System
 * Platform-agnostic border radius values
 */

export const radius = {
  none: 0,
  sm: 4,     // 0.25rem = 4px (calc(var(--radius) - 4px))
  md: 6,     // 0.375rem = 6px (calc(var(--radius) - 2px))
  DEFAULT: 10, // 0.625rem = 10px (var(--radius))
  lg: 12,    // 0.75rem = 12px
  xl: 16,    // 1rem = 16px
  '2xl': 24, // 1.5rem = 24px
  '3xl': 32, // 2rem = 32px
  full: 9999, // Full circle/pill
} as const

export type RadiusKey = keyof typeof radius
export type RadiusValue = (typeof radius)[RadiusKey]

/**
 * Convert radius value to rem for web
 * @param value Radius value in px
 * @returns Rem string
 */
export function radiusToRem(value: number): string {
  if (value === 9999) {
    return '9999px'
  }
  return `${value / 16}rem`
}

/**
 * Get radius value for platform
 * @param key Radius key
 * @param format Output format ('number' | 'px' | 'rem')
 * @returns Radius value
 */
export function getRadius(
  key: RadiusKey,
  format: 'number' | 'px' | 'rem' = 'number'
): string | number {
  const value = radius[key]

  if (format === 'number') {
    return value
  }

  if (format === 'px') {
    return `${value}px`
  }

  return radiusToRem(value)
}
