/**
 * Animation tokens for Tesserix Design System
 * Timing and easing functions for smooth animations
 */

// Animation durations (in milliseconds)
export const duration = {
  instant: 0,
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
  slowest: 1000,
} as const

export type DurationKey = keyof typeof duration
export type DurationValue = (typeof duration)[DurationKey]

// Easing functions (CSS timing functions)
export const easing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

export type EasingKey = keyof typeof easing
export type EasingValue = (typeof easing)[EasingKey]

// React Native easing types (for Animated API)
export const nativeEasing = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const

export type NativeEasingKey = keyof typeof nativeEasing

/**
 * Get animation duration
 * @param key Duration key
 * @param format Output format ('ms' | 's' | 'number')
 * @returns Duration value
 */
export function getDuration(
  key: DurationKey,
  format: 'ms' | 's' | 'number' = 'number'
): string | number {
  const value = duration[key]

  if (format === 'number') {
    return value
  }

  if (format === 'ms') {
    return `${value}ms`
  }

  return `${value / 1000}s`
}

/**
 * Get CSS transition string
 * @param property CSS property to transition
 * @param durationKey Duration key
 * @param easingKey Easing key
 * @returns CSS transition string
 */
export function getTransition(
  property: string = 'all',
  durationKey: DurationKey = 'normal',
  easingKey: EasingKey = 'easeInOut'
): string {
  return `${property} ${getDuration(durationKey, 'ms')} ${easing[easingKey]}`
}

// Common transition presets
export const transitions = {
  none: 'none',
  all: getTransition('all'),
  colors: getTransition('background-color, border-color, color, fill, stroke'),
  opacity: getTransition('opacity'),
  shadow: getTransition('box-shadow'),
  transform: getTransition('transform'),
} as const

export type TransitionKey = keyof typeof transitions
