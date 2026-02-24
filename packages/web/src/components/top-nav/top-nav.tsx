import * as React from "react"

import { cn } from "../../lib/utils"

const TopNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header ref={ref} className={cn("sticky top-0 z-30 border-b bg-background/85 backdrop-blur-sm", className)} {...props} />
  )
)
TopNav.displayName = "TopNav"

const TopNavContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 md:px-6", className)} {...props} />
  )
)
TopNavContainer.displayName = "TopNavContainer"

const TopNavBrand = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2 text-sm font-semibold", className)} {...props} />
  )
)
TopNavBrand.displayName = "TopNavBrand"

const TopNavLinks = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("hidden items-center gap-1 md:flex", className)} {...props} />
  )
)
TopNavLinks.displayName = "TopNavLinks"

interface TopNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

const TopNavLink = React.forwardRef<HTMLAnchorElement, TopNavLinkProps>(
  ({ className, active = false, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "inline-flex rounded-md px-3 py-1.5 text-sm transition-colors",
        active ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    />
  )
)
TopNavLink.displayName = "TopNavLink"

const TopNavActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("ml-auto flex items-center gap-2", className)} {...props} />
  )
)
TopNavActions.displayName = "TopNavActions"

export { TopNav, TopNavContainer, TopNavBrand, TopNavLinks, TopNavLink, TopNavActions }
