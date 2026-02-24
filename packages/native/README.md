# @tesserix/native

React Native UI components for the Tesserix Design System.

## Roadmap

- v1.1 execution plan: [V1_1_ROADMAP.md](./V1_1_ROADMAP.md)

## Features

- Expo-first design (compatible with bare React Native)
- Built with `@tesserix/tokens` for consistent theming
- TypeScript support
- Platform-optimized components
- Lightweight and tree-shakeable

## Installation

```bash
npm install @tesserix/native @tesserix/tokens
# or
pnpm add @tesserix/native @tesserix/tokens
# or
yarn add @tesserix/native @tesserix/tokens
```

### Peer Dependencies

```bash
npm install react react-native
```

## Usage

### Layout Components

```tsx
import { Box, Stack, VStack, HStack, Flex } from '@tesserix/native'

function MyScreen() {
  return (
    <Box p={4} bg="#f3f4f6">
      <VStack space={4}>
        <Box p={3} bg="#ffffff" rounded>
          <Text>Card content</Text>
        </Box>
        <HStack space={2}>
          <Button>Action 1</Button>
          <Button variant="outline">Action 2</Button>
        </HStack>
      </VStack>
    </Box>
  )
}
```

### Typography

```tsx
import { Text, Heading, H1, H2 } from '@tesserix/native'

function Article() {
  return (
    <>
      <H1>Main Title</H1>
      <H2>Subtitle</H2>
      <Text size="base" color="#6b7280">
        Body text with custom color
      </Text>
      <Text bold>Bold text</Text>
      <Text italic>Italic text</Text>
    </>
  )
}
```

### Buttons

```tsx
import { Button } from '@tesserix/native'

function Actions() {
  return (
    <>
      <Button variant="solid" colorScheme="primary">
        Primary Action
      </Button>
      <Button variant="outline" colorScheme="error">
        Delete
      </Button>
      <Button variant="ghost" isLoading>
        Loading...
      </Button>
    </>
  )
}
```

## Available Components

### Layout
- **Box** - Flexible container with spacing props
- **Stack** - Vertical/horizontal stack with spacing
- **VStack** - Vertical stack (alias for Stack with direction="column")
- **HStack** - Horizontal stack (alias for Stack with direction="row")
- **Flex** - Flexbox container with flex props

### Typography
- **Text** - Text component with size and weight props
- **Heading** - Heading component with levels (H1-H6)

### Buttons
- **Button** - Touchable button with variants and states
- **IconButton** - Icon-only action button

### Forms
- **FormControl** - Field wrapper with label/helper/error support
- **Field** - Composed form field helper that injects state/accessibility props
- **Form** / **useForm** - Form state container and validation lifecycle
- **FormField** - Binds form state to controls with FormControl integration
- **useFieldArray** - Array field operations (`append`, `remove`, `update`, `replace`)
- **createZodAdapter** / **createYupAdapter** - Schema validation adapters
- **Input** - Single-line text input
- **Textarea** - Multi-line text input
- **Select** - Option picker with modal menu
- **Checkbox** - Binary/multi-select checkbox
- **Radio** / **RadioGroup** - Single-select options
- **Switch** - On/off toggle
- **FileUpload** - File/image selection with preview and remove

### Overlays
- **Modal** - Centered dialog overlay
- **BottomSheet** - Bottom-anchored overlay panel
- **Drawer** - Side drawer overlay
- **ActionSheet** - Mobile action chooser sheet
- **Toast** - Timed notification popup
- **ChatBubble** - Conversation message bubble
- **ImageGallery** - Thumbnail and fullscreen image gallery
- **InfiniteScroll** - Paginated list wrapper with loading/end states
- **FloatingMenu** - Expandable floating action menu
- **Countdown** - Live countdown timer component
- **CopyToClipboard** - Copy-action trigger with copied feedback

## Design Tokens

This package uses `@tesserix/tokens` for:
- Spacing scale (4px-based)
- Typography (font sizes, weights)
- Colors (semantic color tokens)

```tsx
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

// Use tokens directly
<Box p={spacing[4]}>
  <Text style={{ fontSize: fontSize.lg }}>Custom styled text</Text>
</Box>
```

## Expo Compatibility

This package is designed Expo-first:

```json
{
  "dependencies": {
    "@tesserix/native": "^1.0.0",
    "expo": "~52.0.0",
    "react-native": "0.76.x"
  }
}
```

## Bare React Native

Also works with bare React Native projects:

```json
{
  "dependencies": {
    "@tesserix/native": "^1.0.0",
    "react-native": "^0.76.0"
  }
}
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type { BoxProps, TextProps, ButtonProps } from '@tesserix/native'

const CustomBox: React.FC<BoxProps> = (props) => <Box {...props} />
```

## License

MIT
