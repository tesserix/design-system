import * as React from "react"

import { cn } from "../../lib/utils"

const AuthLayout = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid min-h-screen grid-cols-1 bg-background text-foreground lg:grid-cols-2",
        className
      )}
      {...props}
    />
  )
)
AuthLayout.displayName = "AuthLayout"

const AuthLayoutBrand = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "relative hidden overflow-hidden border-r bg-gradient-to-br from-primary/10 via-card to-background p-10 lg:flex lg:flex-col lg:justify-between",
        className
      )}
      {...props}
    />
  )
)
AuthLayoutBrand.displayName = "AuthLayoutBrand"

const AuthLayoutContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn("flex items-center justify-center px-4 py-10 sm:px-6", className)}
      {...props}
    />
  )
)
AuthLayoutContent.displayName = "AuthLayoutContent"

const AuthCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg sm:p-8", className)}
      {...props}
    />
  )
)
AuthCard.displayName = "AuthCard"

const AuthCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("mb-6 space-y-1", className)} {...props} />
)
AuthCardHeader.displayName = "AuthCardHeader"

const AuthCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("text-xl font-semibold tracking-tight", className)} {...props} />
  )
)
AuthCardTitle.displayName = "AuthCardTitle"

const AuthCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
AuthCardDescription.displayName = "AuthCardDescription"

const AuthCardDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { label?: string }
>(({ className, label = "or", ...props }, ref) => (
  <div ref={ref} className={cn("relative my-6", className)} {...props}>
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <span className="relative mx-auto block w-fit bg-card px-2 text-xs uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
  </div>
))
AuthCardDivider.displayName = "AuthCardDivider"

const AuthSocialProviders = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-2 sm:grid-cols-2", className)}
      {...props}
    />
  )
)
AuthSocialProviders.displayName = "AuthSocialProviders"

export interface AuthSocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  provider: string
  icon?: React.ReactNode
  display?: "icon-only" | "text-only" | "icon-text"
  iconPosition?: "left" | "right"
}

const AuthSocialButton = React.forwardRef<HTMLButtonElement, AuthSocialButtonProps>(
  (
    {
      className,
      provider,
      icon,
      display,
      iconPosition = "left",
      children,
      type,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const resolvedDisplay =
      display ?? (icon && children ? "icon-text" : icon ? "icon-only" : "text-only")
    const defaultLabel = `Continue with ${provider}`
    const labelContent = children ?? defaultLabel
    const computedAriaLabel =
      ariaLabel ?? (resolvedDisplay === "icon-only" ? defaultLabel : undefined)

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex h-10 w-full items-center justify-center rounded-md border bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          resolvedDisplay === "icon-only" ? "px-0" : "gap-2",
          className
        )}
        aria-label={computedAriaLabel}
        {...props}
      >
        {resolvedDisplay !== "text-only" && iconPosition === "left" && icon ? (
          <span aria-hidden="true" className="flex shrink-0 items-center justify-center">
            {icon}
          </span>
        ) : null}
        {resolvedDisplay !== "icon-only" ? (
          <span className="block min-w-0 truncate whitespace-nowrap">{labelContent}</span>
        ) : null}
        {resolvedDisplay !== "text-only" && iconPosition === "right" && icon ? (
          <span aria-hidden="true" className="flex shrink-0 items-center justify-center">
            {icon}
          </span>
        ) : null}
      </button>
    )
  }
)
AuthSocialButton.displayName = "AuthSocialButton"

export {
  AuthLayout,
  AuthLayoutBrand,
  AuthLayoutContent,
  AuthCard,
  AuthCardHeader,
  AuthCardTitle,
  AuthCardDescription,
  AuthCardDivider,
  AuthSocialProviders,
  AuthSocialButton,
}
