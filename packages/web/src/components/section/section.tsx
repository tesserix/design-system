import * as React from "react"

import { cn } from "../../lib/utils"

const Container = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)} {...props} />
  )
)
Container.displayName = "Container"

const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={cn("py-10 md:py-14", className)} {...props} />
  )
)
Section.displayName = "Section"

const SectionHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-6 flex flex-wrap items-end justify-between gap-3", className)} {...props} />
  )
)
SectionHeader.displayName = "SectionHeader"

const SectionTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-xl font-semibold tracking-tight sm:text-2xl", className)} {...props} />
  )
)
SectionTitle.displayName = "SectionTitle"

const SectionDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("max-w-2xl text-sm text-muted-foreground", className)} {...props} />
  )
)
SectionDescription.displayName = "SectionDescription"

export { Container, Section, SectionHeader, SectionTitle, SectionDescription }
