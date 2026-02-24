/**
 * Z-index tokens for Tesserix Design System
 * Layering scale for stacking contexts
 */

export const zIndex = {
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  drawer: 1800,
} as const

export type ZIndexKey = keyof typeof zIndex
export type ZIndexValue = (typeof zIndex)[ZIndexKey]

/**
 * Get z-index value
 * @param key Z-index key
 * @returns Z-index value
 */
export function getZIndex(key: ZIndexKey): string | number {
  return zIndex[key]
}
