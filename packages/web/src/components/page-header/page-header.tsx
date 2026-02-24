import * as React from "react"

import { cn } from "../../lib/utils"

const PageHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-b from-card to-background p-4 shadow-sm sm:p-6",
        className
      )}
      {...props}
    />
  )
)
PageHeader.displayName = "PageHeader"

const PageHeaderTop = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", className)} {...props} />
  )
)
PageHeaderTop.displayName = "PageHeaderTop"

const PageHeaderContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", className)} {...props} />
  )
)
PageHeaderContent.displayName = "PageHeaderContent"

const PageHeaderHeading = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
)
PageHeaderHeading.displayName = "PageHeaderHeading"

const PageHeaderTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("text-xl font-semibold tracking-tight text-foreground sm:text-2xl", className)} {...props} />
  )
)
PageHeaderTitle.displayName = "PageHeaderTitle"

const PageHeaderDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("max-w-2xl text-sm text-muted-foreground", className)} {...props} />
  )
)
PageHeaderDescription.displayName = "PageHeaderDescription"

const PageHeaderActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap items-center gap-2", className)} {...props} />
  )
)
PageHeaderActions.displayName = "PageHeaderActions"

export {
  PageHeader,
  PageHeaderTop,
  PageHeaderContent,
  PageHeaderHeading,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
}
