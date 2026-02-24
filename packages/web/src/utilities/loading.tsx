import * as React from "react"
import { cn } from "../lib/utils"
import { Portal } from "./portal"

interface LoadingContextValue {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = React.createContext<LoadingContextValue | undefined>(undefined)

export interface LoadingProviderProps {
  children: React.ReactNode
}

/**
 * Provider for global loading state
 */
export function LoadingProvider({ children }: LoadingProviderProps) {
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
      {isLoading && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </Portal>
      )}
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

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   */
  size?: "sm" | "md" | "lg"
}

/**
 * Loading spinner component
 */
export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-2",
      lg: "h-12 w-12 border-3",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-solid border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

export interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the dots
   */
  size?: "sm" | "md" | "lg"
}

/**
 * Loading dots component
 */
export const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-1 w-1",
      md: "h-2 w-2",
      lg: "h-3 w-3",
    }

    return (
      <div ref={ref} className={cn("flex items-center space-x-1", className)} {...props}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-bounce",
              sizeClasses[size]
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    )
  }
)
LoadingDots.displayName = "LoadingDots"

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the overlay is visible
   */
  visible: boolean
  /**
   * Loading message
   */
  message?: string
}

/**
 * Loading overlay component
 */
export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, visible, message, children, ...props }, ref) => {
    if (!visible) return <>{children}</>

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-inherit z-10">
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner />
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton loading component (for loading states)
 */
export const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...props}
      />
    )
  }
)
LoadingSkeleton.displayName = "LoadingSkeleton"
