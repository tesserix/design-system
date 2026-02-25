import { Platform } from 'react-native'

/**
 * Get theme color from CSS variables when running in web (Storybook)
 * Falls back to default color for native platforms
 */
export function getThemeColor(cssVar: string, fallback: string): string {
  // Only read from CSS variables in web environment (Storybook)
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
      if (value) {
        // If it's an HSL value like "222.2 47.4% 11.2%", convert to hsl()
        if (value.match(/^[\d.]+\s+[\d.]+%\s+[\d.]+%$/)) {
          return `hsl(${value})`
        }
        return value
      }
    } catch (e) {
      // Fall back to default if CSS var reading fails
    }
  }
  return fallback
}
