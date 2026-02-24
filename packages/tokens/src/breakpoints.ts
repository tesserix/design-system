/**
 * Breakpoint tokens for Tesserix Design System
 * Responsive breakpoint values (primarily for web)
 */

export const breakpoints = {
  sm: 640,   // 40rem
  md: 768,   // 48rem
  lg: 1024,  // 64rem
  xl: 1280,  // 80rem
  '2xl': 1400, // 87.5rem (custom for container)
} as const

export type BreakpointKey = keyof typeof breakpoints
export type BreakpointValue = (typeof breakpoints)[BreakpointKey]

/**
 * Convert breakpoint to em for media queries
 * @param value Breakpoint value in px
 * @returns Em string
 */
export function breakpointToEm(value: number): string {
  return `${value / 16}em`
}

/**
 * Get breakpoint value in specified format
 * @param key Breakpoint key
 * @param format Output format ('number' | 'px' | 'em')
 * @returns Breakpoint value
 */
export function getBreakpoint(
  key: BreakpointKey,
  format: 'number' | 'px' | 'em' = 'number'
): string | number {
  const value = breakpoints[key]

  if (format === 'number') {
    return value
  }

  if (format === 'px') {
    return `${value}px`
  }

  return breakpointToEm(value)
}

/**
 * Generate media query string for web
 * @param key Breakpoint key
 * @param type Query type ('min' | 'max')
 * @returns Media query string
 */
export function mediaQuery(key: BreakpointKey, type: 'min' | 'max' = 'min'): string {
  return `@media (${type}-width: ${breakpointToEm(breakpoints[key])})`
}

/**
 * Check if window width matches breakpoint (for web)
 * @param key Breakpoint key
 * @param type Query type ('min' | 'max')
 * @returns Boolean
 */
export function matchesBreakpoint(key: BreakpointKey, type: 'min' | 'max' = 'min'): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const value = breakpoints[key]
  const width = window.innerWidth

  return type === 'min' ? width >= value : width < value
}
