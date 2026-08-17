"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthField, AuthInput } from "./auth-field"
import { evaluatePasswordRules, type PasswordPolicy } from "./auth-policy"

export interface AuthPasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value: string
  onValueChange: (value: string) => void
  label?: React.ReactNode
  error?: React.ReactNode
  hint?: React.ReactNode
  /**
   * The tenant's password policy. Supplying it renders the live checklist;
   * omitting it renders a plain password field, which is what a sign-in form
   * wants — the rules belong on the screens that *set* a password.
   */
  complexityPolicy?: PasswordPolicy
  /** Show the requirement checklist. Defaults to on whenever a policy is given. */
  showRequirements?: boolean
  /** Lets the caller label this a passphrase, or anything else the product calls it. */
  revealLabel?: string
  hideLabel?: string
}

const CheckIcon = ({ satisfied }: { satisfied: boolean }) => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mt-0.5 shrink-0"
  >
    {satisfied ? <path d="M13 4.5 6.5 11 3 7.5" /> : <circle cx="8" cy="8" r="3" />}
  </svg>
)

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg
    aria-hidden="true"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    {off ? <path d="m3 3 18 18" /> : null}
  </svg>
)

/**
 * A password (or passphrase) field that renders exactly the rules the tenant's
 * complexity policy requires — no more, no fewer — and never blocks typing.
 */
const AuthPasswordField = React.forwardRef<HTMLInputElement, AuthPasswordFieldProps>(
  (
    {
      value,
      onValueChange,
      label = "Password",
      error,
      hint,
      complexityPolicy,
      showRequirements,
      revealLabel = "Show password",
      hideLabel = "Hide password",
      id,
      className,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const fieldId = id ?? generatedId
    const [revealed, setRevealed] = React.useState(false)

    const withRequirements = showRequirements ?? Boolean(complexityPolicy)
    const rules = React.useMemo(
      () => (withRequirements ? evaluatePasswordRules(value, complexityPolicy) : []),
      [withRequirements, value, complexityPolicy]
    )

    return (
      <AuthField label={label} error={error} hint={hint} htmlFor={fieldId} className={className}>
        <AuthInput
          ref={ref}
          id={fieldId}
          type={revealed ? "text" : "password"}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          invalid={Boolean(error)}
          aria-describedby={
            error ? `${fieldId}-error` : withRequirements ? `${fieldId}-requirements` : undefined
          }
          trailing={
            <button
              type="button"
              onClick={() => setRevealed((previous) => !previous)}
              aria-label={revealed ? hideLabel : revealLabel}
              aria-pressed={revealed}
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ color: "var(--auth-subtle)" }}
            >
              <EyeIcon off={revealed} />
            </button>
          }
          {...props}
        />

        {withRequirements && rules.length > 0 ? (
          <ul
            id={`${fieldId}-requirements`}
            className="mt-1 flex flex-col gap-1 text-xs"
            // Rules restate themselves as they flip; polite so it never
            // interrupts the character echo while typing.
            aria-live="polite"
          >
            {rules.map((rule) => (
              <li
                key={rule.id}
                className={cn("flex items-start gap-1.5")}
                style={{ color: rule.satisfied ? "var(--auth-accent)" : "var(--auth-subtle)" }}
              >
                <CheckIcon satisfied={rule.satisfied} />
                <span>
                  {rule.label}
                  <span className="sr-only">{rule.satisfied ? " — met" : " — not met yet"}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </AuthField>
    )
  }
)
AuthPasswordField.displayName = "AuthPasswordField"

export { AuthPasswordField }
