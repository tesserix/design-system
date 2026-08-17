"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthError, AuthLinkButton, AuthSubmitButton } from "./auth-field"
import { describeSecondFactor, type AuthSecondFactor } from "./auth-policy"

const FACTOR_ICON: Record<AuthSecondFactor, React.ReactNode> = {
  totp: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </>
  ),
  securityKey: (
    <>
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
      <rect x="4" y="11" width="16" height="10" rx="2" />
    </>
  ),
  emailCode: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  smsCode: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
}

const FactorIcon = ({ factor }: { factor: AuthSecondFactor }) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    {FACTOR_ICON[factor]}
  </svg>
)

export interface AuthMfaSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Only these factors are offered. */
  factors: AuthSecondFactor[]
  onSelect: (factor: AuthSecondFactor) => void
  /** Renders the factor as the recommended one, first in the list. */
  preferred?: AuthSecondFactor
  /** Copy override per factor, for products with their own vocabulary. */
  labels?: Partial<Record<AuthSecondFactor, string>>
}

/**
 * Lets someone pick among the second factors their tenant enabled. Renders
 * nothing for an empty policy, and skips straight past a single option only if
 * the caller decides to — choosing for the user is the caller's call, not ours.
 */
const AuthMfaSelector = React.forwardRef<HTMLDivElement, AuthMfaSelectorProps>(
  ({ factors, onSelect, preferred, labels, className, ...props }, ref) => {
    if (factors.length === 0) return null

    const ordered = preferred
      ? [...factors].sort((a, b) => (a === preferred ? -1 : b === preferred ? 1 : 0))
      : factors

    return (
      <div ref={ref} className={cn("flex flex-col gap-2", className)} role="group" {...props}>
        {ordered.map((factor) => {
          const described = describeSecondFactor(factor)
          return (
            <button
              key={factor}
              type="button"
              onClick={() => onSelect(factor)}
              data-auth-control=""
              className="flex w-full items-start gap-3 px-3.5 py-3 text-left text-sm"
              style={{
                background: "var(--auth-input)",
                border: "1px solid var(--auth-input-border)",
                color: "var(--auth-foreground)",
                borderRadius: "var(--auth-radius, 0.75rem)",
              }}
            >
              <span style={{ color: "var(--auth-accent)" }}>
                <FactorIcon factor={factor} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {labels?.[factor] ?? described.label}
                  {factor === preferred ? (
                    <span className="ml-2 text-[0.6875rem] font-normal" style={{ color: "var(--auth-subtle)" }}>
                      Recommended
                    </span>
                  ) : null}
                </span>
                <span className="text-xs" style={{ color: "var(--auth-muted)" }}>
                  {described.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    )
  }
)
AuthMfaSelector.displayName = "AuthMfaSelector"

export interface AuthOtpStepProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (code: string) => void
  /** Which factor produced this code; drives the default copy only. */
  factor?: AuthSecondFactor
  length?: number
  loading?: boolean
  error?: React.ReactNode
  label?: React.ReactNode
  description?: React.ReactNode
  submitLabel?: string
  /** Resend is only meaningful for the codes we send (`otpEmail`, `otpSms`). */
  onResend?: () => void
  resendLabel?: string
  /** Seconds until resend becomes available; the caller owns the countdown. */
  resendIn?: number
  onUseAnotherMethod?: () => void
}

/**
 * One-time-code entry, shared by TOTP, emailed and texted codes. Submits itself
 * once the code is complete, because every one of those flows is a fixed-length
 * code and making someone reach for a button after the last digit is friction.
 */
const AuthOtpStep = React.forwardRef<HTMLInputElement, AuthOtpStepProps>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      factor = "totp",
      length = 6,
      loading,
      error,
      label = "Verification code",
      description,
      submitLabel = "Verify",
      onResend,
      resendLabel = "Send a new code",
      resendIn = 0,
      onUseAnotherMethod,
      className,
      ...props
    },
    ref
  ) => {
    const fieldId = React.useId()
    const described = describeSecondFactor(factor)
    const submittedFor = React.useRef<string | null>(null)

    const handleChange = (next: string) => {
      const digits = next.replace(/\D/g, "").slice(0, length)
      onValueChange(digits)
    }

    // Auto-submit once, per completed code, so a corrected entry can resubmit
    // but a re-render cannot fire the same code twice.
    React.useEffect(() => {
      if (value.length !== length || loading) return
      if (submittedFor.current === value) return
      submittedFor.current = value
      onSubmit(value)
    }, [value, length, loading, onSubmit])

    React.useEffect(() => {
      if (value.length < length) submittedFor.current = null
    }, [value, length])

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!loading) onSubmit(value)
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <AuthError message={error} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor={fieldId} className="text-[0.8125rem] font-medium" style={{ color: "var(--auth-label)" }}>
            {label}
          </label>
          <p className="text-xs" style={{ color: "var(--auth-muted)" }}>
            {description ?? described.description}
          </p>
          <input
            ref={ref}
            id={fieldId}
            data-auth-control=""
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern={`\\d{${length}}`}
            maxLength={length}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            autoFocus
            className="min-h-12 w-full px-3.5 text-center text-lg tracking-[0.5em]"
            style={{
              background: "var(--auth-input)",
              border: "1px solid var(--auth-input-border)",
              color: "var(--auth-foreground)",
              borderRadius: "var(--auth-radius, 0.75rem)",
            }}
          />
        </div>

        <AuthSubmitButton loading={loading}>{submitLabel}</AuthSubmitButton>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {onResend ? (
            <AuthLinkButton onClick={onResend} disabled={resendIn > 0}>
              {resendIn > 0 ? `${resendLabel} in ${resendIn}s` : resendLabel}
            </AuthLinkButton>
          ) : null}
          {onUseAnotherMethod ? (
            <AuthLinkButton onClick={onUseAnotherMethod}>Use another method</AuthLinkButton>
          ) : null}
        </div>
      </form>
    )
  }
)
AuthOtpStep.displayName = "AuthOtpStep"

export interface AuthPasskeyPromptProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  onUsePasskey: () => void
  loading?: boolean
  error?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  actionLabel?: string
  /** Offered only when the tenant still allows a password fallback. */
  onUsePassword?: () => void
  usePasswordLabel?: string
}

/**
 * The passwordless entry point, shown when the tenant allows passkeys. The host owns the WebAuthn call; this is the surface that invites it.
 */
const AuthPasskeyPrompt = React.forwardRef<HTMLDivElement, AuthPasskeyPromptProps>(
  (
    {
      onUsePasskey,
      loading,
      error,
      title = "Use a passkey",
      description = "Sign in with your fingerprint, face or device PIN.",
      actionLabel = "Continue with a passkey",
      onUsePassword,
      usePasswordLabel = "Use a password instead",
      className,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
      <AuthError message={error} />
      <div className="flex flex-col gap-1 text-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs" style={{ color: "var(--auth-muted)" }}>
          {description}
        </p>
      </div>
      <AuthSubmitButton type="button" loading={loading} onClick={onUsePasskey}>
        {actionLabel}
      </AuthSubmitButton>
      {onUsePassword ? (
        <div className="flex justify-center">
          <AuthLinkButton onClick={onUsePassword}>{usePasswordLabel}</AuthLinkButton>
        </div>
      ) : null}
    </div>
  )
)
AuthPasskeyPrompt.displayName = "AuthPasskeyPrompt"

export { AuthMfaSelector, AuthOtpStep, AuthPasskeyPrompt }
