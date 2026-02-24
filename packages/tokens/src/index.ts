/**
 * Tesserix Design Tokens
 * Platform-agnostic design tokens for web and React Native
 *
 * For optimal tree-shaking, import directly from subpaths:
 * import { themes } from '@tesserix/tokens/colors'
 * import { spacing } from '@tesserix/tokens/spacing'
 */

// Export types only for main entry to avoid bundling all values
export type { ColorMode, ColorTokens, ThemeColors, ThemeName } from './colors'
export type { SpacingKey, SpacingValue, SemanticSpacingKey } from './spacing'
export type {
  FontFamilyKey,
  FontSizeKey,
  FontSizeValue,
  FontWeightKey,
  FontWeightValue,
  LineHeightKey,
  LineHeightValue,
  LetterSpacingKey,
  LetterSpacingValue,
  TypographyPreset,
  TypographyPresetKey,
} from './typography'
export type { RadiusKey, RadiusValue } from './radius'
export type {
  ShadowKey,
  ShadowValue,
  ElevationKey,
  ElevationValue,
  IOSShadow,
} from './shadows'
export type { BreakpointKey, BreakpointValue } from './breakpoints'
export type { ZIndexKey, ZIndexValue } from './z-index'
export type {
  DurationKey,
  DurationValue,
  EasingKey,
  EasingValue,
  NativeEasingKey,
  TransitionKey,
} from './animations'

// Re-export commonly used utilities and constants
// Users can import these or use direct imports for better tree-shaking
export { getThemeColors, hslToRgba, hslToRgb, hslToHsla, themes } from './colors'
export { getSpacing, spacingToRem } from './spacing'
export { getTypographyPreset, fontSizeToRem, getFontFamily } from './typography'
export { getRadius } from './radius'
export { getNativeShadow, getWebShadow } from './shadows'
export { getBreakpoint, mediaQuery, matchesBreakpoint } from './breakpoints'
export { getZIndex } from './z-index'
export { getDuration, getTransition } from './animations'
