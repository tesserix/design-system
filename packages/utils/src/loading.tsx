import * as React from "react"

interface LoadingContextValue {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = React.createContext<LoadingContextValue | undefined>(undefined)

export interface LoadingProviderProps {
  children: React.ReactNode
  /**
   * Optional loading overlay component to render when loading
   */
  loadingComponent?: React.ReactNode
}

/**
 * Provider for global loading state (cross-platform)
 */
export function LoadingProvider({ children, loadingComponent }: LoadingProviderProps) {
  const [isLoading, setLoading] = React.useState(false)

  const value = React.useMemo(
    () => ({
      isLoading,
      setLoading,
    }),
    [isLoading]
  )

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && loadingComponent}
    </LoadingContext.Provider>
  )
}

/**
 * Hook to access loading state
 */
export function useLoading() {
  const context = React.useContext(LoadingContext)

  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }

  return context
}

// Platform-specific components (LoadingSpinner, LoadingDots, etc.)
// can be overridden by @tesserix/web and @tesserix/native packages
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  label?: string
}

export interface LoadingDotsProps {
  size?: "sm" | "md" | "lg"
}

export interface LoadingOverlayProps {
  visible: boolean
  children?: React.ReactNode
  loadingComponent?: React.ReactNode
}

export interface LoadingSkeletonProps {
  children?: React.ReactNode
}

/**
 * Minimal cross-platform loading spinner fallback.
 */
export function LoadingSpinner(_props: LoadingSpinnerProps) {
  return null
}

/**
 * Minimal cross-platform loading dots fallback.
 */
export function LoadingDots(_props: LoadingDotsProps) {
  return null
}

/**
 * Minimal cross-platform loading overlay fallback.
 */
export function LoadingOverlay({ visible, children, loadingComponent }: LoadingOverlayProps) {
  if (!visible) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      {loadingComponent ?? <LoadingSpinner />}
    </>
  )
}

/**
 * Minimal cross-platform loading skeleton fallback.
 */
export function LoadingSkeleton({ children }: LoadingSkeletonProps) {
  return <>{children ?? null}</>
}
