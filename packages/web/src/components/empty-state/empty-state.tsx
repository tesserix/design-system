import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const emptyStateVariants = cva(
  "flex w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-card text-center",
  {
    variants: {
      size: {
        sm: "gap-2 p-6",
        md: "gap-3 p-8",
        lg: "gap-4 p-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(({ className, size, ...props }, ref) => (
  <div ref={ref} className={cn(emptyStateVariants({ size }), className)} {...props} />
))
EmptyState.displayName = "EmptyState"

const EmptyStateIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
EmptyStateIcon.displayName = "EmptyStateIcon"

const EmptyStateTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold text-card-foreground", className)} {...props} />
  )
)
EmptyStateTitle.displayName = "EmptyStateTitle"

const EmptyStateDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("max-w-md text-sm text-muted-foreground", className)} {...props} />
  )
)
EmptyStateDescription.displayName = "EmptyStateDescription"

const EmptyStateActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-2 flex flex-wrap items-center justify-center gap-2", className)} {...props} />
  )
)
EmptyStateActions.displayName = "EmptyStateActions"

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
  emptyStateVariants,
}
