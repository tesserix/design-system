"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthError, AuthField, AuthInput, AuthLinkButton, AuthSubmitButton } from "./auth-field"
import { AuthPasswordField } from "./auth-password-field"
import { describeLoginName, isPasswordCompliant, type AuthMethodPolicy, type PasswordPolicy } from "./auth-policy"

export interface AuthPasswordResetRequestProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "title"> {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (loginName: string) => void
  methodPolicy?: AuthMethodPolicy
  loading?: boolean
  error?: React.ReactNode
  /**
   * Shown after a successful request. Deliberately does not confirm whether the
   * account exists — the same message regardless is what stops this endpoint
   * being an account-enumeration oracle.
   */
  sent?: boolean
  sentMessage?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  submitLabel?: string
  onBack?: () => void
  backLabel?: string
}

/** Step one of a password reset: say who you are. */
const AuthPasswordResetRequest = React.forwardRef<HTMLFormElement, AuthPasswordResetRequestProps>(
  (
    {
      value,
      onValueChange,
      onSubmit,
      methodPolicy = {},
      loading,
      error,
      sent = false,
      sentMessage = "If that account exists, we've sent a link to reset the password.",
      title = "Reset your password",
      description = "We'll send you a link to set a new one.",
      submitLabel = "Send reset link",
      onBack,
      backLabel = "Back to sign in",
      className,
      ...props
    },
    ref
  ) => {
    const fieldId = React.useId()

    return (
      <form
        ref={ref}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (!loading) onSubmit(value)
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <AuthError message={error} />

        <div className="flex flex-col gap-1 text-center">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs" style={{ color: "var(--auth-muted)" }}>
            {description}
          </p>
        </div>

        {sent ? (
          <p
            role="status"
            className="px-3.5 py-2.5 text-center text-xs"
            style={{
              color: "var(--auth-muted)",
              border: "1px solid var(--auth-input-border)",
              borderRadius: "var(--auth-radius, 0.75rem)",
            }}
          >
            {sentMessage}
          </p>
        ) : (
          <>
            <AuthField label={describeLoginName(methodPolicy)} htmlFor={fieldId}>
              <AuthInput
                id={fieldId}
                name="loginName"
                value={value}
                onChange={(event) => onValueChange(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                invalid={Boolean(error)}
                autoFocus
                required
              />
            </AuthField>
            <AuthSubmitButton loading={loading}>{submitLabel}</AuthSubmitButton>
          </>
        )}

        {onBack ? (
          <div className="flex justify-center">
            <AuthLinkButton onClick={onBack}>{backLabel}</AuthLinkButton>
          </div>
        ) : null}
      </form>
    )
  }
)
AuthPasswordResetRequest.displayName = "AuthPasswordResetRequest"

export interface AuthSetPasswordFormProps extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "title"> {
  password: string
  onPasswordChange: (password: string) => void
  confirmPassword: string
  onConfirmPasswordChange: (password: string) => void
  onSubmit: (password: string) => void
  passwordPolicy?: PasswordPolicy
  loading?: boolean
  error?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  submitLabel?: string
  passwordLabel?: React.ReactNode
  confirmLabel?: React.ReactNode
  mismatchMessage?: string
}

/**
 * Sets a new password — after a reset link, an invite, or a forced change.
 * The mismatch only surfaces once the confirmation has been typed into, so it
 * never accuses someone of an error they are still in the middle of avoiding.
 */
const AuthSetPasswordForm = React.forwardRef<HTMLFormElement, AuthSetPasswordFormProps>(
  (
    {
      password,
      onPasswordChange,
      confirmPassword,
      onConfirmPasswordChange,
      onSubmit,
      passwordPolicy,
      loading,
      error,
      title = "Choose a new password",
      description,
      submitLabel = "Save password",
      passwordLabel = "New password",
      confirmLabel = "Confirm password",
      mismatchMessage = "Those passwords don't match.",
      className,
      ...props
    },
    ref
  ) => {
    const mismatch = confirmPassword.length > 0 && confirmPassword !== password
    const canSubmit = isPasswordCompliant(password, passwordPolicy) && password === confirmPassword

    return (
      <form
        ref={ref}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (!loading && canSubmit) onSubmit(password)
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <AuthError message={error} />

        {title || description ? (
          <div className="flex flex-col gap-1 text-center">
            {title ? <p className="text-sm font-medium">{title}</p> : null}
            {description ? (
              <p className="text-xs" style={{ color: "var(--auth-muted)" }}>
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <AuthPasswordField
          label={passwordLabel}
          value={password}
          onValueChange={onPasswordChange}
          complexityPolicy={passwordPolicy}
          showRequirements
          autoComplete="new-password"
          required
        />

        <AuthPasswordField
          label={confirmLabel}
          value={confirmPassword}
          onValueChange={onConfirmPasswordChange}
          error={mismatch ? mismatchMessage : undefined}
          autoComplete="new-password"
          required
        />

        <AuthSubmitButton loading={loading} disabled={!canSubmit}>
          {submitLabel}
        </AuthSubmitButton>
      </form>
    )
  }
)
AuthSetPasswordForm.displayName = "AuthSetPasswordForm"

export interface AuthLockoutNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Attempts left before the account locks. Omit when unknown. */
  attemptsRemaining?: number
  /** The account is already locked. */
  locked?: boolean
  lockedMessage?: React.ReactNode
  supportEmail?: string
}

/**
 * Warns as an account approaches its lockout threshold, and explains the lock
 * once it happens. Renders nothing while there is nothing worth saying —
 * counting down from ten attempts would only alarm people.
 */
const AuthLockoutNotice = React.forwardRef<HTMLDivElement, AuthLockoutNoticeProps>(
  ({ attemptsRemaining, locked = false, lockedMessage, supportEmail, className, style, ...props }, ref) => {
    const warn = attemptsRemaining !== undefined && attemptsRemaining > 0 && attemptsRemaining <= 3

    if (!locked && !warn) return null

    const message = locked
      ? (lockedMessage ?? "This account is locked after too many failed attempts.")
      : `${attemptsRemaining} ${attemptsRemaining === 1 ? "attempt" : "attempts"} remaining before this account is locked.`

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
        {locked && supportEmail ? (
          <>
            {" "}
            <a href={`mailto:${supportEmail}`} data-auth-link="">
              Contact support
            </a>
            .
          </>
        ) : null}
      </div>
    )
  }
)
AuthLockoutNotice.displayName = "AuthLockoutNotice"

export { AuthPasswordResetRequest, AuthSetPasswordForm, AuthLockoutNotice }
