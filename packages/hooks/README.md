# @tesserix/hooks

Cross-platform React hooks for web and React Native applications.

## Installation

```bash
npm install @tesserix/hooks
# or
pnpm add @tesserix/hooks
# or
yarn add @tesserix/hooks
```

## Usage

```tsx
import { useToggle, useAsync, useDebounce } from '@tesserix/hooks'

function MyComponent() {
  const { value, toggle } = useToggle()
  const debouncedValue = useDebounce(searchTerm, 300)

  // ... your component logic
}
```

## Available Hooks

### State Management
- `useToggle` - Boolean state with helper methods
- `useAsync` - Async operation state management
- `usePrevious` - Track previous value
- `useBoolean` - Boolean state with semantic helpers
- `useCounter` - Counter with increment/decrement
- `useArray` - Array manipulation helpers
- `useMap` - Map state management
- `useSet` - Set state management

### Timing
- `useDebounce` - Debounce values
- `useInterval` - setInterval wrapper
- `useTimeout` - setTimeout wrapper
- `useThrottle` - Throttle values

### Lifecycle
- `useOnMount` - Execute on component mount
- `useOnUnmount` - Execute on component unmount
- `useMounted` - Check if component is mounted
- `useEffectOnce` - Run effect only once
- `useUpdateEffect` - Skip first render

### Form & Input
- `useForm` - Form state management

## Platform Compatibility

All hooks in this package are cross-platform and work with both React (web) and React Native.

## License

MIT
