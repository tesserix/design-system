import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const sidebarNavItemVariants = cva(
  "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      active: {
        true: "bg-primary/12 font-medium text-primary",
        false: "text-muted-foreground hover:bg-muted hover:text-foreground",
      },
      compact: {
        true: "justify-center px-2",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      compact: false,
    },
  }
)

export interface SidebarNavItemData {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
}

const SidebarNav = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => <nav ref={ref} className={cn("space-y-5", className)} {...props} />
)
SidebarNav.displayName = "SidebarNav"

const SidebarNavSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <section ref={ref} className={cn("space-y-2", className)} {...props} />
)
SidebarNavSection.displayName = "SidebarNavSection"

const SidebarNavLabel = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)} {...props} />
  )
)
SidebarNavLabel.displayName = "SidebarNavLabel"

interface SidebarNavListProps extends React.HTMLAttributes<HTMLUListElement> {}

const SidebarNavList = React.forwardRef<HTMLUListElement, SidebarNavListProps>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("space-y-1", className)} {...props} />
))
SidebarNavList.displayName = "SidebarNavList"

interface SidebarNavItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof sidebarNavItemVariants> {
  icon?: React.ReactNode
  badge?: React.ReactNode
}

const SidebarNavItem = React.forwardRef<HTMLAnchorElement, SidebarNavItemProps>(
  ({ className, active, compact, icon, badge, children, ...props }, ref) => (
    <a ref={ref} className={cn(sidebarNavItemVariants({ active, compact }), className)} {...props}>
      {icon ? <span className="text-current/80">{icon}</span> : null}
      {!compact ? (
        <>
          <span className="truncate">{children}</span>
          {badge ? <span className="ml-auto text-xs text-muted-foreground">{badge}</span> : null}
        </>
      ) : (
        <span className="sr-only">{children}</span>
      )}
    </a>
  )
)
SidebarNavItem.displayName = "SidebarNavItem"

export { SidebarNav, SidebarNavSection, SidebarNavLabel, SidebarNavList, SidebarNavItem, sidebarNavItemVariants }
