import * as React from "react"

import { cn } from "../../lib/utils"

const DashboardLayout = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("min-h-screen bg-background text-foreground", className)} {...props} />
  )
)
DashboardLayout.displayName = "DashboardLayout"

const DashboardLayoutHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn("sticky top-0 z-20 border-b bg-background/85 px-4 py-3 backdrop-blur-sm md:px-6", className)}
      {...props}
    />
  )
)
DashboardLayoutHeader.displayName = "DashboardLayoutHeader"

const DashboardLayoutBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:px-6 lg:grid-cols-[1fr_300px]", className)} {...props} />
  )
)
DashboardLayoutBody.displayName = "DashboardLayoutBody"

const DashboardLayoutMain = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => <main ref={ref} className={cn("space-y-4", className)} {...props} />
)
DashboardLayoutMain.displayName = "DashboardLayoutMain"

const DashboardLayoutRail = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside ref={ref} className={cn("space-y-4", className)} {...props} />
  )
)
DashboardLayoutRail.displayName = "DashboardLayoutRail"

export {
  DashboardLayout,
  DashboardLayoutHeader,
  DashboardLayoutBody,
  DashboardLayoutMain,
  DashboardLayoutRail,
}
