/**
 * @tesserix/icons
 *
 * Icon library for Tesserix Design System
 * - Lucide icons wrapper for web and React Native
 * - Custom brand and design-specific icons
 *
 * @see https://lucide.dev
 */

// Re-export types only from main entry for tree-shaking
export type { LucideProps, LucideIcon, IconSize } from './web'
export type { CustomIconProps, CustomIconName } from './custom'

// Re-export utilities
export { iconSizes, getIconSize } from './web'
export { customIcons } from './custom'

/**
 * Platform-specific icon exports:
 *
 * For web (React):
 * @example
 * import { Home, Search, iconSizes } from '@tesserix/icons/web'
 *
 * For React Native:
 * @example
 * import { Home, Search, iconSizes } from '@tesserix/icons/native'
 *
 * For custom icons:
 * @example
 * import { TesserixLogo } from '@tesserix/icons/custom'
 */
