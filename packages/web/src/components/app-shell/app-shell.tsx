import * as React from "react"

import { cn } from "../../lib/utils"

const AppShell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid min-h-screen w-full grid-cols-1 bg-background text-foreground lg:grid-cols-[280px_1fr]", className)}
      {...props}
    />
  )
)
AppShell.displayName = "AppShell"

const AppShellSidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "border-b bg-card/70 p-4 backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0 lg:p-6",
        className
      )}
      {...props}
    />
  )
)
AppShellSidebar.displayName = "AppShellSidebar"

const AppShellMain = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex min-w-0 flex-col", className)} {...props} />
)
AppShellMain.displayName = "AppShellMain"

const AppShellHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-10 border-b bg-background/85 px-4 py-3 backdrop-blur-sm supports-[backdrop-filter]:bg-background/70 md:px-6",
        className
      )}
      {...props}
    />
  )
)
AppShellHeader.displayName = "AppShellHeader"

const AppShellContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn("flex-1 px-4 py-4 md:px-6 md:py-6", className)} {...props} />
  )
)
AppShellContent.displayName = "AppShellContent"

const AppShellFooter = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn("border-t px-4 py-3 text-xs text-muted-foreground md:px-6", className)}
      {...props}
    />
  )
)
AppShellFooter.displayName = "AppShellFooter"

export { AppShell, AppShellSidebar, AppShellMain, AppShellHeader, AppShellContent, AppShellFooter }
