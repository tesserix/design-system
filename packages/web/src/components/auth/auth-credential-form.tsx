"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthError, AuthField, AuthInput, AuthLinkButton, AuthSubmitButton } from "./auth-field"
import { AuthPasswordField } from "./auth-password-field"
import { describeLoginName, type AuthMethodPolicy } from "./auth-policy"

export interface AuthCredentialValues {
  loginName: string
  password: string
}

export interface AuthCredentialFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange"> {
  /**
   * Everything optional on this form is decided by it: whether passwords are
   * allowed at all, whether registration and reset links show, and which
   * identifiers the login name field accepts.
   */
  methodPolicy?: AuthMethodPolicy
  values: AuthCredentialValues
  onValuesChange: (values: AuthCredentialValues) => void
  onSubmit: (values: AuthCredentialValues) => void
  loading?: boolean
  /** Form-level failure, e.g. "That username and password don't match." */
  error?: React.ReactNode
  loginNameError?: React.ReactNode
  passwordError?: React.ReactNode
  /**
   * Two-step flow: collect the login name, then the password. Zitadel's own
   * login does this so it can branch to an IdP or passkey before asking for a
   * secret. Defaults to a single step.
   */
  stepped?: boolean
  /** Which step to show when `stepped`. Controlled by the caller. */
  step?: "loginName" | "password"
  onStepChange?: (step: "loginName" | "password") => void
  /** Hides the `@org` hint under the field. */
  loginNameSuffix?: string
  hideLoginNameSuffix?: boolean
  submitLabel?: string
  loginNameLabel?: React.ReactNode
  passwordLabel?: React.ReactNode
  onForgotPassword?: () => void
  onRegister?: () => void
  forgotPasswordLabel?: string
  registerLabel?: string
}

/**
 * The username/password half of a sign-in flow. Renders nothing at all when
 * the tenant disallows password auth — a policy-driven surface should disappear
 * rather than offer a method the backend will reject.
 */
const AuthCredentialForm = React.forwardRef<HTMLFormElement, AuthCredentialFormProps>(
  (
    {
      methodPolicy = {},
      values,
      onValuesChange,
      onSubmit,
      loading,
      error,
      loginNameError,
      passwordError,
      stepped = false,
      step = "loginName",
      onStepChange,
      loginNameSuffix,
      hideLoginNameSuffix,
      submitLabel,
      loginNameLabel,
      passwordLabel = "Password",
      onForgotPassword,
      onRegister,
      forgotPasswordLabel = "Forgot password?",
      registerLabel = "Create an account",
      className,
      ...props
    },
    ref
  ) => {
    const loginNameId = React.useId()

    if (methodPolicy.allowPassword === false) return null

    const showPassword = !stepped || step === "password"
    const showLoginName = !stepped || step === "loginName"
    const showReset = !methodPolicy.hidePasswordReset && Boolean(onForgotPassword) && showPassword
    const showRegister = methodPolicy.allowRegister !== false && Boolean(onRegister)
    const suffixVisible = Boolean(loginNameSuffix) && !hideLoginNameSuffix && showLoginName

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (loading) return
      if (stepped && step === "loginName") {
        onStepChange?.("password")
        return
      }
      onSubmit(values)
    }

    const resolvedSubmitLabel =
      submitLabel ?? (stepped && step === "loginName" ? "Continue" : "Sign in")

    return (
      <form ref={ref} onSubmit={handleSubmit} noValidate className={cn("flex flex-col gap-4", className)} {...props}>
        <AuthError message={error} />

        {showLoginName ? (
          <AuthField
            label={loginNameLabel ?? describeLoginName(methodPolicy)}
            htmlFor={loginNameId}
            error={loginNameError}
            hint={suffixVisible ? loginNameSuffix : undefined}
          >
            <AuthInput
              id={loginNameId}
              name="loginName"
              value={values.loginName}
              onChange={(event) => onValuesChange({ ...values, loginName: event.target.value })}
              invalid={Boolean(loginNameError)}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              // Zitadel's own login autofocuses this; it is the first thing a
              // returning user wants and costs a keyboard user nothing.
              autoFocus
              required
            />
          </AuthField>
        ) : null}

        {showPassword ? (
          <AuthPasswordField
            label={passwordLabel}
            value={values.password}
            onValueChange={(password) => onValuesChange({ ...values, password })}
            error={passwordError}
            autoComplete="current-password"
            required
          />
        ) : null}

        {showReset ? (
          <div className="-mt-1 flex justify-end">
            <AuthLinkButton onClick={onForgotPassword}>{forgotPasswordLabel}</AuthLinkButton>
          </div>
        ) : null}

        <AuthSubmitButton loading={loading}>{resolvedSubmitLabel}</AuthSubmitButton>

        {showRegister ? (
          <p className="text-center text-xs" style={{ color: "var(--auth-subtle)" }}>
            <AuthLinkButton onClick={onRegister}>{registerLabel}</AuthLinkButton>
          </p>
        ) : null}
      </form>
    )
  }
)
AuthCredentialForm.displayName = "AuthCredentialForm"

export { AuthCredentialForm }
