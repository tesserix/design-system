# @tesserix/icons

Icon library for the Tesserix Design System - Lucide icons wrapper + custom brand icons.

## Features

- Lucide icons for web (React) and React Native
- Platform-specific optimizations
- Custom brand and design-specific icons
- TypeScript support
- Tree-shakeable exports
- Icon size utilities based on design tokens

## Installation

```bash
npm install @tesserix/icons
# or
pnpm add @tesserix/icons
# or
yarn add @tesserix/icons
```

### Peer Dependencies

Install the appropriate Lucide package for your platform:

**For web (React):**
```bash
npm install lucide-react
```

**For React Native:**
```bash
npm install lucide-react-native react-native-svg
```

Both are optional peer dependencies - install only what you need.

## Usage

### Web (React)

```tsx
import { Home, Search, Star, iconSizes, getIconSize } from '@tesserix/icons/web'

function MyComponent() {
  return (
    <div>
      <Home size={iconSizes.md} />
      <Search size={getIconSize('lg')} />
      <Star size={24} className="text-yellow-500" />
    </div>
  )
}
```

### React Native

```tsx
import { Home, Search, Star, iconSizes, getIconSize } from '@tesserix/icons/native'
import { View } from 'react-native'

function MyComponent() {
  return (
    <View>
      <Home size={iconSizes.md} color="#000" />
      <Search size={getIconSize('lg')} color="#666" />
      <Star size={24} color="#FFD700" />
    </View>
  )
}
```

### Custom Icons

```tsx
import { TesserixLogo, Twitter, LinkedIn, Instagram } from '@tesserix/icons/custom'

function MyComponent() {
  return (
    <>
      <TesserixLogo size={32} className="text-primary" />
      <Twitter size={24} className="text-blue-500" />
      <LinkedIn size={24} className="text-blue-700" />
      <Instagram size={24} className="text-pink-500" />
    </>
  )
}
```

**Available custom icons:**
- `TesserixLogo` - Placeholder brand logo (replace with your actual SVG)
- `Twitter` - Twitter/X social icon
- `LinkedIn` - LinkedIn social icon
- `Facebook` - Facebook social icon
- `Instagram` - Instagram social icon
- `YouTube` - YouTube social icon
- `Threads` - Threads social icon
- `TikTok` - TikTok social icon
- `Apple` - Apple social icon

## Icon Sizes

Pre-defined icon sizes based on Tesserix design tokens:

| Size | Pixels |
|------|--------|
| xs   | 12     |
| sm   | 16     |
| md   | 20     |
| lg   | 24     |
| xl   | 32     |
| 2xl  | 40     |

```tsx
import { iconSizes, getIconSize } from '@tesserix/icons/web'

// Direct access
const size = iconSizes.md // 20

// Using helper function
const size = getIconSize('lg') // 24
const defaultSize = getIconSize() // 20 (md is default)
```

## Available Icons

This package re-exports all icons from Lucide with commonly used icons grouped for convenience:

### Navigation
Home, Menu, X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowLeft, ArrowRight, ArrowUp, ArrowDown

### Actions
Plus, Minus, Edit, Trash2, Save, Copy, Download, Upload, Share2, ExternalLink

### UI
Search, Settings, User, Users, Bell, Mail, Calendar, Clock, Heart, Star

### Status
Check, CheckCircle, AlertCircle, AlertTriangle, Info, XCircle, HelpCircle, Loader2

### Media
Image, File, FileText, Folder, FolderOpen, Camera, Video, Music

### Other
Eye, EyeOff, Lock, Unlock, LogIn, LogOut, MoreHorizontal, MoreVertical, Github

For the complete list of available icons, visit [Lucide Icons](https://lucide.dev/icons/).

## Adding Custom Icons

To add custom brand icons, edit `src/custom/index.tsx`:

```tsx
export function MyCustomIcon({ size = 24, className, ...props }: CustomIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Your SVG paths */}
    </svg>
  )
}

// Add to exports
export const customIcons = {
  TesserixLogo,
  MyCustomIcon,
} as const
```

## Tree-Shaking

For optimal bundle size, import directly from platform-specific subpaths:

```tsx
// Recommended (only bundles web icons)
import { Home, Search } from '@tesserix/icons/web'

// Recommended (only bundles React Native icons)
import { Home, Search } from '@tesserix/icons/native'

// Also works (smaller bundle - only types and utilities)
import type { IconSize } from '@tesserix/icons'
import { iconSizes } from '@tesserix/icons'
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { LucideProps, LucideIcon, IconSize } from '@tesserix/icons'
import type { CustomIconProps } from '@tesserix/icons/custom'

const MyIcon: LucideIcon = Home
const size: IconSize = 'lg'
```

## License

MIT
