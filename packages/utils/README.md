# @tesserix/utils

Cross-platform utilities and components for web and React Native applications.

## Installation

```bash
npm install @tesserix/utils
# or
pnpm add @tesserix/utils
# or
yarn add @tesserix/utils
```

## Usage

```tsx
import { ErrorBoundary, LoadingProvider, useLoading } from '@tesserix/utils'

function App() {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <MyApp />
      </LoadingProvider>
    </ErrorBoundary>
  )
}
```

## Available Utilities

### Error Handling
- `ErrorBoundary` - Catch and handle component errors

### Loading States
- `LoadingProvider` - Global loading state provider
- `useLoading` - Access loading state
- `LoadingSpinner` - Loading spinner component
- `LoadingDots` - Animated loading dots
- `LoadingOverlay` - Full-screen loading overlay
- `LoadingSkeleton` - Skeleton placeholder

### Theme Management
- `ThemeProvider` - Theme context provider
- `useTheme` - Access theme context

## Platform Compatibility

All utilities in this package are cross-platform and work with both React (web) and React Native.

Platform-specific implementations are automatically selected based on the runtime environment.

## License

MIT
