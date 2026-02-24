/**
 * Shadow tokens for Tesserix Design System
 * Box shadow values for web and elevation styles for React Native
 */

// Web box shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

export type ShadowKey = keyof typeof shadows
export type ShadowValue = (typeof shadows)[ShadowKey]

// React Native elevation values (Android)
// Maps to Material Design elevation
export const elevation = {
  none: 0,
  sm: 1,
  DEFAULT: 2,
  md: 4,
  lg: 6,
  xl: 8,
  '2xl': 12,
} as const

export type ElevationKey = keyof typeof elevation
export type ElevationValue = (typeof elevation)[ElevationKey]

// iOS shadow configuration for React Native
export interface IOSShadow {
  shadowColor: string
  shadowOffset: { width: number; height: number }
  shadowOpacity: number
  shadowRadius: number
}

export const iosShadows: Record<ElevationKey, IOSShadow> = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  DEFAULT: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
  },
}

/**
 * Get shadow configuration for React Native
 * Combines elevation (Android) and iOS shadow properties
 * @param key Shadow key
 * @returns React Native shadow style object
 */
export function getNativeShadow(key: ElevationKey): Record<string, unknown> {
  return {
    elevation: elevation[key],
    ...iosShadows[key],
  }
}

/**
 * Get web box shadow
 * @param key Shadow key
 * @returns CSS box-shadow string
 */
export function getWebShadow(key: ShadowKey): string {
  return shadows[key]
}
