import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const dashboardCardVariants = cva(
  "rounded-2xl border bg-card text-card-foreground shadow-sm transition-colors",
  {
    variants: {
      tone: {
        default: "border-border",
        success: "border-primary/40 bg-primary/10",
        warning: "border-accent bg-accent",
        critical: "border-destructive/40 bg-destructive/10",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  }
)

export interface DashboardCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardCardVariants> {}

const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ className, tone, ...props }, ref) => (
    <article ref={ref} className={cn(dashboardCardVariants({ tone }), className)} {...props} />
  )
)
DashboardCard.displayName = "DashboardCard"

const DashboardCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn("flex items-start justify-between gap-3 border-b px-5 py-4", className)}
      {...props}
    />
  )
)
DashboardCardHeader.displayName = "DashboardCardHeader"

const DashboardCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-sm font-semibold tracking-tight", className)} {...props} />
  )
)
DashboardCardTitle.displayName = "DashboardCardTitle"

const DashboardCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("mt-1 text-xs text-muted-foreground", className)} {...props} />
))
DashboardCardDescription.displayName = "DashboardCardDescription"

const DashboardCardValue = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-2xl font-semibold tracking-tight", className)} {...props} />
  )
)
DashboardCardValue.displayName = "DashboardCardValue"

const DashboardCardTrend = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium", className)}
      {...props}
    />
  )
)
DashboardCardTrend.displayName = "DashboardCardTrend"

const DashboardCardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-2 px-5 py-4", className)} {...props} />
)
DashboardCardBody.displayName = "DashboardCardBody"

const DashboardCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <footer ref={ref} className={cn("border-t px-5 py-3 text-xs text-muted-foreground", className)} {...props} />
  )
)
DashboardCardFooter.displayName = "DashboardCardFooter"

export {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardCardDescription,
  DashboardCardValue,
  DashboardCardTrend,
  DashboardCardBody,
  DashboardCardFooter,
  dashboardCardVariants,
}
