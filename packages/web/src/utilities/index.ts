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
  ThemeProviderProps,
} from "@tesserix/utils"

// Re-export web-specific loading components from the web loading utility
export { LoadingSpinner, LoadingDots, LoadingOverlay, LoadingSkeleton } from "./loading"
export type {
  LoadingSpinnerProps,
  LoadingDotsProps,
  LoadingOverlayProps,
  LoadingSkeletonProps,
} from "./loading"

// Web-specific utilities
export { Portal } from "./portal"
export type { PortalProps } from "./portal"

export { VisuallyHidden } from "./visually-hidden"
export type { VisuallyHiddenProps } from "./visually-hidden"

export { FocusTrap } from "./focus-trap"
export type { FocusTrapProps } from "./focus-trap"

export {
  useBreakpoint,
  Show,
  Hide,
} from "./responsive"
export type { ShowProps, HideProps } from "./responsive"

export {
  FadeIn,
  SlideIn,
  ScaleIn,
  useAnimatedValue,
} from "./animation"
export type { FadeInProps, SlideInProps, ScaleInProps } from "./animation"
