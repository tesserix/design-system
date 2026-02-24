# @tesserix/tokens

Platform-agnostic design tokens for the Tesserix Design System.

## Installation

```bash
npm install @tesserix/tokens
# or
pnpm add @tesserix/tokens
# or
yarn add @tesserix/tokens
```

## Usage

### Colors

```typescript
import { defaultColors, themes, getThemeColors, hslToRgba } from '@tesserix/tokens/colors'

// Get theme colors
const colors = getThemeColors('default', 'light')

// Convert HSL to RGBA for React Native
const primaryColor = hslToRgba(colors.primary) // 'rgba(70, 82, 99, 1)'
```

Available themes (23 total):
- **Original**: `default`, `emerald`, `sapphire`, `rose`, `amber`, `violet`, `teal`
- **Neutral**: `slate`, `zinc`, `stone`
- **Vibrant**: `indigo`, `cyan`, `lime`, `orange`, `pink`, `crimson`
- **Nature**: `forest`, `ocean`, `sunset`, `lavender`
- **Specialty**: `neon`, `midnight`, `mocha`

### Spacing

```typescript
import { spacing, semanticSpacing, getSpacing } from '@tesserix/tokens/spacing'

// Direct values (in pixels)
const gap = spacing[4] // 16

// Semantic aliases
const padding = semanticSpacing.md // 16

// Convert to rem for web
const margin = getSpacing(8, 'rem') // '2rem'
```

### Typography

```typescript
import {
  fontSize,
  fontWeight,
  typographyPresets,
  getTypographyPreset,
} from '@tesserix/tokens/typography'

// Font sizes
const heading = fontSize['2xl'] // 24

// Typography presets for web
const h1Styles = getTypographyPreset('h1', 'web')
// { fontSize: '2.25rem', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.025em' }

// Typography presets for React Native
const h1Native = getTypographyPreset('h1', 'native')
// { fontSize: 36, lineHeight: 43.2, fontWeight: '700', letterSpacing: -0.9 }
```

### Border Radius

```typescript
import { radius, getRadius } from '@tesserix/tokens/radius'

// Direct values
const borderRadius = radius.DEFAULT // 10

// Get in different formats
const rounded = getRadius('lg', 'rem') // '0.75rem'
```

### Shadows

```typescript
import { shadows, getNativeShadow, getWebShadow } from '@tesserix/tokens/shadows'

// Web shadows
const boxShadow = getWebShadow('md')

// React Native shadows (combines elevation + iOS shadow)
const nativeShadow = getNativeShadow('md')
// { elevation: 4, shadowColor: '#000', shadowOffset: {...}, shadowOpacity: 0.1, shadowRadius: 6 }
```

### Breakpoints

```typescript
import { breakpoints, mediaQuery, getBreakpoint } from '@tesserix/tokens/breakpoints'

// Direct values
const tablet = breakpoints.md // 768

// Media queries (web)
const query = mediaQuery('md', 'min') // '@media (min-width: 48em)'

// Get in different formats
const bp = getBreakpoint('lg', 'px') // '1024px'
```

### Z-Index

```typescript
import { zIndex, getZIndex } from '@tesserix/tokens/z-index'

const modalZIndex = zIndex.modal // 1400
const tooltipZIndex = getZIndex('tooltip') // 1600
```

### Animations

```typescript
import { duration, easing, getTransition, transitions } from '@tesserix/tokens/animations'

// Animation durations
const animDuration = duration.normal // 200

// CSS transitions
const transition = getTransition('opacity', 'fast', 'easeOut')
// 'opacity 150ms cubic-bezier(0, 0, 0.2, 1)'

// Preset transitions
const allTransition = transitions.all
```

## Platform Compatibility

All tokens are designed to work across both web and React Native:

- **Web**: Use tokens directly with CSS-in-JS, Tailwind, or CSS variables
- **React Native**: Tokens provide numeric values and conversion utilities

### Web Example

```typescript
import { getThemeColors, spacing, getTypographyPreset } from '@tesserix/tokens'

const colors = getThemeColors('default', 'light')
const styles = {
  padding: spacing[4], // 16
  backgroundColor: `hsl(${colors.primary})`,
  ...getTypographyPreset('body', 'web'),
}
```

### React Native Example

```typescript
import { hslToRgba, spacing, getTypographyPreset } from '@tesserix/tokens'
import { StyleSheet } from 'react-native'

const colors = getThemeColors('default', 'light')

const styles = StyleSheet.create({
  container: {
    padding: spacing[4], // 16
    backgroundColor: hslToRgba(colors.primary),
    ...getTypographyPreset('body', 'native'),
  },
})
```

## Token Categories

- **Colors**: Semantic color tokens with 23 theme variants
- **Spacing**: 4px-based spacing scale
- **Typography**: Font sizes, weights, line heights, and presets
- **Radius**: Border radius values
- **Shadows**: Box shadows (web) and elevation (React Native)
- **Breakpoints**: Responsive breakpoint values
- **Z-Index**: Stacking context layers
- **Animations**: Duration and easing functions

## Tree-Shaking & Bundle Size Optimization

The package is optimized for tree-shaking. For the smallest bundle size, import directly from subpaths:

```typescript
// Recommended: Direct imports (best for tree-shaking)
import { getThemeColors, slateColors } from '@tesserix/tokens/colors'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

// Also works: Main entry (includes commonly used utilities)
import { getThemeColors, themes } from '@tesserix/tokens'
```

**Bundle size impact:**
- Main entry (`@tesserix/tokens`): ~8KB gzipped (includes all utilities + themes object)
- Subpath imports: ~1-3KB gzipped (only what you use)
- Individual theme colors: ~0.5KB gzipped

When using modern bundlers (Vite, Webpack 5+, Rollup), unused themes and tokens are automatically removed from your bundle.

## License

MIT
