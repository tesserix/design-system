"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthError, AuthField, AuthInput, AuthSubmitButton } from "./auth-field"
import { AuthPasswordField } from "./auth-password-field"
import { isPasswordCompliant, type AuthLegalLinks, type AuthMethodPolicy, type PasswordPolicy } from "./auth-policy"

export interface AuthRegisterValues {
  email: string
  givenName: string
  familyName: string
  password: string
  acceptedTerms: boolean
}

export interface AuthRegisterFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange"> {
  values: AuthRegisterValues
  onValuesChange: (values: AuthRegisterValues) => void
  onSubmit: (values: AuthRegisterValues) => void
  /** Registration disappears when the tenant disallows it. */
  methodPolicy?: AuthMethodPolicy
  /** Drives the live requirement checklist on the password field. */
  passwordPolicy?: PasswordPolicy
  /** Terms and privacy links. A terms link makes acceptance mandatory. */
  legal?: AuthLegalLinks
  loading?: boolean
  error?: React.ReactNode
  fieldErrors?: Partial<Record<keyof AuthRegisterValues, React.ReactNode>>
  submitLabel?: string
  onSignIn?: () => void
  signInLabel?: string
  /** Set false for tenants that only collect an email. */
  collectName?: boolean
  passwordLabel?: React.ReactNode
}

/**
 * Account creation. The submit button stays disabled until the password meets
 * the tenant's policy and any required terms are accepted, so the first thing
 * someone learns about a rule is not a rejected submit.
 */
const AuthRegisterForm = React.forwardRef<HTMLFormElement, AuthRegisterFormProps>(
  (
    {
      values,
      onValuesChange,
      onSubmit,
      methodPolicy = {},
      passwordPolicy,
      legal,
      loading,
      error,
      fieldErrors,
      submitLabel = "Create account",
      onSignIn,
      signInLabel = "Sign in instead",
      collectName = true,
      passwordLabel = "Password",
      className,
      ...props
    },
    ref
  ) => {
    const emailId = React.useId()
    const givenNameId = React.useId()
    const familyNameId = React.useId()
    const termsId = React.useId()

    if (methodPolicy.allowRegister === false) return null

    const termsRequired = Boolean(legal?.termsUrl)
    const passwordOk = isPasswordCompliant(values.password, passwordPolicy)
    const canSubmit = passwordOk && (!termsRequired || values.acceptedTerms)

    return (
      <form
        ref={ref}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          if (loading || !canSubmit) return
          onSubmit(values)
        }}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <AuthError message={error} />

        {collectName ? (
          <div className="flex gap-3">
            <AuthField label="First name" htmlFor={givenNameId} error={fieldErrors?.givenName} className="flex-1">
              <AuthInput
                id={givenNameId}
                name="givenName"
                autoComplete="given-name"
                value={values.givenName}
                onChange={(event) => onValuesChange({ ...values, givenName: event.target.value })}
                invalid={Boolean(fieldErrors?.givenName)}
              />
            </AuthField>
            <AuthField label="Last name" htmlFor={familyNameId} error={fieldErrors?.familyName} className="flex-1">
              <AuthInput
                id={familyNameId}
                name="familyName"
                autoComplete="family-name"
                value={values.familyName}
                onChange={(event) => onValuesChange({ ...values, familyName: event.target.value })}
                invalid={Boolean(fieldErrors?.familyName)}
              />
            </AuthField>
          </div>
        ) : null}

        <AuthField label="Email" htmlFor={emailId} error={fieldErrors?.email}>
          <AuthInput
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={values.email}
            onChange={(event) => onValuesChange({ ...values, email: event.target.value })}
            invalid={Boolean(fieldErrors?.email)}
            required
          />
        </AuthField>

        <AuthPasswordField
          label={passwordLabel}
          value={values.password}
          onValueChange={(password) => onValuesChange({ ...values, password })}
          complexityPolicy={passwordPolicy}
          showRequirements
          error={fieldErrors?.password}
          autoComplete="new-password"
          required
        />

        {termsRequired ? (
          <div className="flex items-start gap-2">
            <input
              id={termsId}
              type="checkbox"
              checked={values.acceptedTerms}
              onChange={(event) => onValuesChange({ ...values, acceptedTerms: event.target.checked })}
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ accentColor: "var(--auth-accent)" }}
              required
            />
            <label htmlFor={termsId} className="text-xs" style={{ color: "var(--auth-muted)" }}>
              I agree to the{" "}
              <a href={legal?.termsUrl} target="_blank" rel="noreferrer noopener" data-auth-link="">
                terms of service
              </a>
              {legal?.privacyUrl ? (
                <>
                  {" "}
                  and{" "}
                  <a href={legal.privacyUrl} target="_blank" rel="noreferrer noopener" data-auth-link="">
                    privacy policy
                  </a>
                </>
              ) : null}
              .
            </label>
          </div>
        ) : null}

        <AuthSubmitButton loading={loading} disabled={!canSubmit}>
          {submitLabel}
        </AuthSubmitButton>

        {onSignIn ? (
          <p className="text-center text-xs" style={{ color: "var(--auth-subtle)" }}>
            <button type="button" data-auth-link="" onClick={onSignIn} className="font-medium">
              {signInLabel}
            </button>
          </p>
        ) : null}
      </form>
    )
  }
)
AuthRegisterForm.displayName = "AuthRegisterForm"

export { AuthRegisterForm }
