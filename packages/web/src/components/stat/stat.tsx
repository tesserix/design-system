import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const statVariants = cva(
  "rounded-2xl border bg-card p-5 shadow-sm",
  {
    variants: {
      size: {
        sm: "p-4",
        md: "p-5",
        lg: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface StatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statVariants> {}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(({ className, size, ...props }, ref) => (
  <div ref={ref} className={cn(statVariants({ size }), className)} {...props} />
))
Stat.displayName = "Stat"

const StatLabel = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm font-medium text-muted-foreground", className)} {...props} />
  )
)
StatLabel.displayName = "StatLabel"

const StatValue = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mt-2 text-2xl font-semibold tracking-tight text-card-foreground", className)} {...props} />
  )
)
StatValue.displayName = "StatValue"

const trendVariants = cva("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", {
  variants: {
    trend: {
      up: "bg-primary/15 text-primary",
      down: "bg-destructive/15 text-destructive",
      neutral: "bg-muted text-muted-foreground",
    },
  },
  defaultVariants: {
    trend: "neutral",
  },
})

export interface StatTrendProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof trendVariants> {}

const StatTrend = React.forwardRef<HTMLSpanElement, StatTrendProps>(({ className, trend, ...props }, ref) => (
  <span ref={ref} className={cn(trendVariants({ trend }), className)} {...props} />
))
StatTrend.displayName = "StatTrend"

const StatMeta = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mt-2 text-xs text-muted-foreground", className)} {...props} />
  )
)
StatMeta.displayName = "StatMeta"

export { Stat, StatLabel, StatValue, StatTrend, StatMeta, statVariants, trendVariants }
