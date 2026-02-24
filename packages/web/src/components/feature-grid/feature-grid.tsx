import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const featureCardVariants = cva("rounded-2xl border bg-card p-5 shadow-sm", {
  variants: {
    emphasis: {
      default: "",
      highlighted: "border-primary/40 bg-primary/5",
      muted: "bg-muted/30",
    },
  },
  defaultVariants: {
    emphasis: "default",
  },
})

const FeatureGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)} {...props} />
  )
)
FeatureGrid.displayName = "FeatureGrid"

interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, emphasis, ...props }, ref) => (
    <article ref={ref} className={cn(featureCardVariants({ emphasis }), className)} {...props} />
  )
)
FeatureCard.displayName = "FeatureCard"

const FeatureIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-3 inline-flex rounded-lg border bg-background p-2 text-primary", className)} {...props} />
  )
)
FeatureIcon.displayName = "FeatureIcon"

const FeatureTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base font-semibold tracking-tight", className)} {...props} />
  )
)
FeatureTitle.displayName = "FeatureTitle"

const FeatureDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mt-2 text-sm text-muted-foreground", className)} {...props} />
))
FeatureDescription.displayName = "FeatureDescription"

export { FeatureGrid, FeatureCard, FeatureIcon, FeatureTitle, FeatureDescription, featureCardVariants }
