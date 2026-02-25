/**
 * Shim for @react-native/normalize-colors
 * This module is internal to React Native and doesn't have proper exports
 * We provide a minimal implementation for web
 */

export default function normalizeColor(color: string | number): number | null {
  if (typeof color === 'number') {
    return color
  }

  // Basic color normalization for common cases
  if (typeof color === 'string') {
    // Handle transparent
    if (color === 'transparent') {
      return 0x00000000
    }

    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1)
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16)
        const g = parseInt(hex[1] + hex[1], 16)
        const b = parseInt(hex[2] + hex[2], 16)
        return ((0xff << 24) | (r << 16) | (g << 8) | b) >>> 0
      }
      if (hex.length === 6) {
        const num = parseInt(hex, 16)
        return ((0xff << 24) | num) >>> 0
      }
      if (hex.length === 8) {
        return parseInt(hex, 16) >>> 0
      }
    }

    // For other color formats (rgb, rgba, named colors), just return null
    // react-native-web will handle these
    return null
  }

  return null
}
