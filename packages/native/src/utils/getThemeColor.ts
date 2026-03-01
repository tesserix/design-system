import { getThemeColors, oklchToRgba, themes, type ColorMode, type ThemeName } from '@tesserix/tokens'

const cssVarTokenMap = {
  '--background': 'background',
  '--foreground': 'foreground',
  '--card': 'card',
  '--card-foreground': 'cardForeground',
  '--popover': 'popover',
  '--popover-foreground': 'popoverForeground',
  '--primary': 'primary',
  '--primary-foreground': 'primaryForeground',
  '--secondary': 'secondary',
  '--secondary-foreground': 'secondaryForeground',
  '--muted': 'muted',
  '--muted-foreground': 'mutedForeground',
  '--accent': 'accent',
  '--accent-foreground': 'accentForeground',
  '--destructive': 'destructive',
  '--destructive-foreground': 'destructiveForeground',
  '--border': 'border',
  '--input': 'input',
  '--ring': 'ring',
} as const

/**
 * Get theme color from CSS variables when running in web (Storybook)
 * Falls back to default color for native platforms
 */
export function getThemeColor(cssVar: string, fallback: string): string {
  const tokenKey = cssVarTokenMap[cssVar as keyof typeof cssVarTokenMap]

  if (typeof document !== 'undefined' && tokenKey) {
    const root = document.documentElement
    const domTheme = root?.getAttribute?.('data-theme')
    if (domTheme && domTheme in themes) {
      const mode: ColorMode = root.classList.contains('dark') ? 'dark' : 'light'
      const tokenValue = getThemeColors(domTheme as ThemeName, mode)[tokenKey]
      if (tokenValue) {
        return oklchToRgba(tokenValue)
      }
    }
  }

  if (typeof window !== 'undefined' && tokenKey) {
    const withStorybookGlobals = window as typeof window & {
      __TESSERIX_STORYBOOK_THEME__?: ThemeName
      __TESSERIX_STORYBOOK_MODE__?: ColorMode
    }
    const activeTheme = withStorybookGlobals.__TESSERIX_STORYBOOK_THEME__
    const activeMode = withStorybookGlobals.__TESSERIX_STORYBOOK_MODE__

    if (activeTheme && (activeMode === 'light' || activeMode === 'dark')) {
      const themeColors = getThemeColors(activeTheme, activeMode)
      const tokenValue = themeColors[tokenKey]
      if (tokenValue) {
        return oklchToRgba(tokenValue)
      }
    }
  }

  // Only read from CSS variables when a DOM is available (e.g. Storybook on web).
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()

      if (value) {
        // Theme CSS variables are stored as OKLCH values (e.g. "oklch(0.37 0.04 253)").
        // Convert them to rgba(...) for reliable React Native Web color parsing.
        if (value.match(/^oklch\(/i)) {
          return oklchToRgba(value)
        }

        return value
      }
    } catch (e) {
      console.warn(`Failed to read CSS variable ${cssVar}:`, e)
      // Fall back to default if CSS var reading fails
    }
  }
  return fallback
}
