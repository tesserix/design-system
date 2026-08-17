"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * Form primitives for the auth auth surface. They paint exclusively from the
 * `--auth-*` custom properties, so a tenant's `LabelPolicy`, the host's design
 * tokens, and the platform default all reach them through the same cascade
 * without any of them knowing which one won.
 */

const FIELD_CSS = `
[data-auth-control]{transition:border-color .15s ease,box-shadow .15s ease}
[data-auth-control]:focus-visible{outline:none;border-color:var(--auth-accent,#5B5FD6);box-shadow:0 0 0 3px color-mix(in srgb,var(--auth-accent,#5B5FD6) 24%,transparent)}
[data-auth-control][aria-invalid="true"]{border-color:var(--auth-warn,#B3261E)}
[data-auth-control]:disabled{opacity:.55;cursor:not-allowed}
[data-auth-submit]{transition:filter .15s ease,box-shadow .15s ease}
[data-auth-submit]:hover:not(:disabled){filter:brightness(1.06)}
[data-auth-submit]:focus-visible{outline:2px solid var(--auth-accent,#5B5FD6);outline-offset:2px}
[data-auth-submit]:disabled{opacity:.55;cursor:not-allowed}
[data-auth-link]{color:var(--auth-accent,#5B5FD6);text-decoration:none}
[data-auth-link]:hover{text-decoration:underline}
[data-auth-link]:focus-visible{outline:2px solid var(--auth-accent,#5B5FD6);outline-offset:2px;border-radius:2px}
`

/** Injected once per page; React hoists it by `href`. */
function AuthFieldStyles() {
  return (
    <style href="tesserix-auth-field" precedence="medium">
      {FIELD_CSS}
    </style>
  )
}

export interface AuthFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode
  /** Rendered beneath the control and wired to it via `aria-describedby`. */
  hint?: React.ReactNode
  /** Announced assertively and marks the control invalid. */
  error?: React.ReactNode
  /** Id of the control this field labels. */
  htmlFor?: string
}

/**
 * Label + control + hint/error, with the wiring a screen reader needs. Pass the
 * control as `children` and give it the ids from `useAuthField`.
 */
const AuthField = React.forwardRef<HTMLDivElement, AuthFieldProps>(
  ({ label, hint, error, htmlFor, className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="text-[0.8125rem] font-medium"
          style={{ color: "var(--auth-label)" }}
        >
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={htmlFor ? `${htmlFor}-error` : undefined} role="alert" className="text-xs" style={{ color: "var(--auth-warn)" }}>
          {error}
        </p>
      ) : hint ? (
        <p id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-xs" style={{ color: "var(--auth-subtle)" }}>
          {hint}
        </p>
      ) : null}
    </div>
  )
)
AuthField.displayName = "AuthField"

export interface AuthInputProps extends React.ComponentProps<"input"> {
  invalid?: boolean
  /** Rendered inside the control's trailing edge — a reveal toggle, say. */
  trailing?: React.ReactNode
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, invalid, trailing, style, ...props }, ref) => (
    <div className="relative flex items-center">
      <AuthFieldStyles />
      <input
        ref={ref}
        data-auth-control=""
        aria-invalid={invalid || undefined}
        className={cn(
          "min-h-11 w-full px-3.5 text-sm",
          trailing ? "pr-11" : undefined,
          className
        )}
        style={
          {
            background: "var(--auth-input)",
            border: "1px solid var(--auth-input-border)",
            color: "var(--auth-foreground)",
            borderRadius: "var(--auth-radius, 0.75rem)",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      />
      {trailing ? <span className="absolute right-2 flex items-center">{trailing}</span> : null}
    </div>
  )
)
AuthInput.displayName = "AuthInput"

export interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Swaps the label for a busy state and blocks further submits. */
  loading?: boolean
  loadingLabel?: string
}

const AuthSubmitButton = React.forwardRef<HTMLButtonElement, AuthSubmitButtonProps>(
  (
    { className, style, children, loading, loadingLabel = "Please wait…", disabled, type = "submit", ...props },
    ref
  ) => (
    <>
      <AuthFieldStyles />
      <button
        ref={ref}
        type={type}
        data-auth-submit=""
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cn("min-h-11 w-full px-4 text-sm font-semibold", className)}
        style={
          {
            background: "var(--auth-button)",
            color: "var(--auth-button-foreground)",
            boxShadow: "var(--auth-button-shadow)",
            borderRadius: "var(--auth-radius, 0.75rem)",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {loading ? loadingLabel : children}
      </button>
    </>
  )
)
AuthSubmitButton.displayName = "AuthSubmitButton"

export interface AuthLinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/** A text action — "Forgot password?", "Use a different method" — as a real button. */
const AuthLinkButton = React.forwardRef<HTMLButtonElement, AuthLinkButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <>
      <AuthFieldStyles />
      <button ref={ref} type={type} data-auth-link="" className={cn("text-xs font-medium", className)} {...props} />
    </>
  )
)
AuthLinkButton.displayName = "AuthLinkButton"

export interface AuthErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nothing renders when there is no message, so callers can pass state directly. */
  message?: React.ReactNode
}

/**
 * Form-level failure. Announced assertively because it usually appears after a
 * submit, when focus has not moved and nothing else would speak.
 */
const AuthError = React.forwardRef<HTMLDivElement, AuthErrorProps>(
  ({ message, className, style, ...props }, ref) => {
    if (!message) return null

    return (
      <div
        ref={ref}
        role="alert"
        className={cn("px-3.5 py-2.5 text-xs", className)}
        style={
          {
            color: "var(--auth-warn)",
            border: "1px solid color-mix(in srgb, var(--auth-warn, #B3261E) 40%, transparent)",
            background: "color-mix(in srgb, var(--auth-warn, #B3261E) 8%, transparent)",
            borderRadius: "var(--auth-radius, 0.75rem)",
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {message}
      </div>
    )
  }
)
AuthError.displayName = "AuthError"

export { AuthField, AuthInput, AuthSubmitButton, AuthLinkButton, AuthError, AuthFieldStyles }
