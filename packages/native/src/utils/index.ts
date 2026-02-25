// Re-export core cross-platform utilities from @tesserix/utils
export {
  ErrorBoundary,
  LoadingProvider,
  useLoading,
  ThemeProvider,
  useTheme,
} from "@tesserix/utils"
export type {
  ErrorBoundaryProps,
  LoadingProviderProps,
  LoadingSpinnerProps,
  LoadingDotsProps,
  LoadingOverlayProps,
  LoadingSkeletonProps,
  ThemeProviderProps,
} from "@tesserix/utils"

// React Native specific utilities
export { getThemeColor } from './getThemeColor'

// Platform-specific implementations of:
// - LoadingSpinner (using ActivityIndicator)
// - LoadingDots (custom React Native animation)
// - LoadingOverlay (using React Native Modal/View)
// - LoadingSkeleton (using Animated.View)
// - Portal (using react-native-portal or custom implementation)
