import * as React from "react"

import { cn } from "../../lib/utils"

const HeroSection = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("relative overflow-hidden rounded-3xl border bg-gradient-to-b from-card to-background px-6 py-12 md:px-10 md:py-16", className)}
      {...props}
    />
  )
)
HeroSection.displayName = "HeroSection"

const HeroEyebrow = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-primary", className)} {...props} />
  )
)
HeroEyebrow.displayName = "HeroEyebrow"

const HeroTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl", className)} {...props} />
  )
)
HeroTitle.displayName = "HeroTitle"

const HeroDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base", className)} {...props} />
  )
)
HeroDescription.displayName = "HeroDescription"

const HeroActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-6 flex flex-wrap items-center gap-2", className)} {...props} />
  )
)
HeroActions.displayName = "HeroActions"

const HeroVisual = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-8 rounded-2xl border bg-card/70 p-4 md:p-6", className)} {...props} />
  )
)
HeroVisual.displayName = "HeroVisual"

export { HeroSection, HeroEyebrow, HeroTitle, HeroDescription, HeroActions, HeroVisual }
