/**
 * @deprecated Superseded by the `auth` component set, which paints from the
 * `--auth-*` custom properties and is driven by a tenant's auth policy rather
 * than by fixed Tailwind classes. Prefer `AuthPanel` plus `AuthCredentialForm`,
 * `AuthProviderList` and friends. These exports still work and are not
 * scheduled for removal in this major.
 */
import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthProviderMark } from "../auth/auth-provider-button"

/** @deprecated Use the `auth` component set instead. */
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

/** @deprecated Use the `auth` component set instead. */
const AuthLayoutBrand = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        "relative flex flex-col justify-between overflow-hidden border-r bg-gradient-to-br from-primary/10 via-card to-background p-10 max-lg:hidden",
        className
      )}
      {...props}
    />
  )
)
AuthLayoutBrand.displayName = "AuthLayoutBrand"

/** @deprecated Use the `auth` component set instead. */
const AuthLayoutContent = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={cn("flex min-h-[100svh] items-center justify-center px-4 py-10 sm:px-6", className)}
      {...props}
    />
  )
)
AuthLayoutContent.displayName = "AuthLayoutContent"

/** @deprecated Use the `auth` component set instead. */
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

/** @deprecated Use the `auth` component set instead. */
const AuthCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("mb-6 space-y-1 text-center", className)} {...props} />
)
AuthCardHeader.displayName = "AuthCardHeader"

/** @deprecated Use the `auth` component set instead. */
const AuthCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h1 ref={ref} className={cn("text-xl font-semibold tracking-tight", className)} {...props} />
  )
)
AuthCardTitle.displayName = "AuthCardTitle"

/** @deprecated Use the `auth` component set instead. */
const AuthCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
AuthCardDescription.displayName = "AuthCardDescription"

/** @deprecated Use the `auth` component set instead. */
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

/** @deprecated Use the `auth` component set instead. */
const AuthSocialProviders = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-2", className)}
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

/** @deprecated Use the `auth` component set instead. */
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
    const brandMark = icon ?? <AuthProviderMark provider={provider} size={18} />
    const resolvedDisplay = display ?? (children ? "icon-text" : "icon-only")
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
        {resolvedDisplay !== "text-only" && iconPosition === "left" ? (
          <span aria-hidden="true" className="flex shrink-0 items-center justify-center">
            {brandMark}
          </span>
        ) : null}
        {resolvedDisplay !== "icon-only" ? (
          <span className="block min-w-0 truncate whitespace-nowrap">{labelContent}</span>
        ) : null}
        {resolvedDisplay !== "text-only" && iconPosition === "right" ? (
          <span aria-hidden="true" className="flex shrink-0 items-center justify-center">
            {brandMark}
          </span>
        ) : null}
      </button>
    )
  }
)
AuthSocialButton.displayName = "AuthSocialButton"

/** @deprecated Use the `auth` component set instead. */
const AuthLayoutCentered = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "min-h-screen flex items-center justify-center relative overflow-hidden bg-background",
        className
      )}
      {...props}
    />
  )
)
AuthLayoutCentered.displayName = "AuthLayoutCentered"

/** @deprecated Use the `auth` component set instead. */
const AuthLayoutBackground = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { src?: string }>(
  ({ className, src, children, ...props }, ref) => (
    <div ref={ref} className={cn("fixed inset-0 -z-20", className)} {...props}>
      {src && (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-background/80" />
      <div className="absolute inset-0 bg-black/20" />
      {children}
    </div>
  )
)
AuthLayoutBackground.displayName = "AuthLayoutBackground"

/** @deprecated Use the `auth` component set instead. */
const AuthCardCentered = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-md px-4 py-8 mx-auto",
        className
      )}
      {...props}
    >
      <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-border p-6 space-y-5">
        {props.children}
      </div>
    </div>
  )
)
AuthCardCentered.displayName = "AuthCardCentered"

/** @deprecated Use the `auth` component set instead. */
const AuthCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-center pt-4 border-t border-border", className)}
      {...props}
    />
  )
)
AuthCardFooter.displayName = "AuthCardFooter"

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
  AuthLayoutCentered,
  AuthLayoutBackground,
  AuthCardCentered,
  AuthCardFooter,
}
