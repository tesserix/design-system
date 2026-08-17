"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuthProviderLayoutContext } from "./auth-provider-list"
import { PROVIDER_MARKS, type AuthProviderId } from "./provider-marks"

export type { AuthProviderId }

const PROVIDER_LABEL: Record<AuthProviderId, string> = {
  google: "Google",
  microsoft: "Microsoft",
  apple: "Apple",
  github: "GitHub",
  gitlab: "GitLab",
  facebook: "Facebook",
  instagram: "Instagram",
  okta: "Okta",
  passkey: "a passkey",
  sso: "SSO",
}

/** Zitadel hands us the tenant's own IdP name; a generic OIDC provider called "Google" is still Google. */
const PROVIDER_ALIAS: Array<[RegExp, AuthProviderId]> = [
  [/\bgoogle\b|\bgsuite\b|google workspace/, "google"],
  [/\bmicrosoft\b|\bazure\b|\bentra\b|office\s?365|\bmsal\b/, "microsoft"],
  [/\bapple\b|\bicloud\b/, "apple"],
  [/\bgithub\b/, "github"],
  [/\bgitlab\b/, "gitlab"],
  [/\bmeta\b|\bfacebook\b|\bfb\b/, "facebook"],
  [/\binstagram\b|\binsta\b/, "instagram"],
  [/\bokta\b/, "okta"],
  [/\bpasskey\b|\bwebauthn\b|\bfido\b/, "passkey"],
]

export function resolveAuthProvider(provider: string): AuthProviderId {
  const name = provider.trim().toLowerCase()
  // Own keys only: `in` would resolve an IdP named "constructor" to a prototype
  // member and render a non-component.
  if (Object.prototype.hasOwnProperty.call(PROVIDER_MARKS, name)) return name as AuthProviderId
  return PROVIDER_ALIAS.find(([pattern]) => pattern.test(name))?.[1] ?? "sso"
}

export interface AuthProviderMarkProps {
  /** A known provider id, or the tenant's IdP display name to resolve one from. */
  provider: AuthProviderId | (string & {})
  size?: number
}

/** Exported on its own so a host with its own button chrome still gets the brand logo. */
function AuthProviderMark({ provider, size }: AuthProviderMarkProps) {
  const Mark = PROVIDER_MARKS[resolveAuthProvider(provider)]
  return <Mark size={size} />
}

const BUTTON_CSS = `
[data-auth-provider-button]{transition:background .15s ease,border-color .15s ease,box-shadow .15s ease}
[data-auth-provider-button]:hover:not(:disabled){background:var(--auth-hover,rgba(15,23,41,.045))}
[data-auth-provider-button]:focus-visible{outline:2px solid var(--auth-accent,#5B5FD6);outline-offset:2px}
[data-auth-provider-button]:disabled{opacity:.55;cursor:not-allowed}
`

export interface AuthProviderButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** A known provider id, or the tenant's IdP display name to resolve one from. */
  provider: AuthProviderId | (string & {})
  /** Defaults to `Continue with <provider>`. */
  label?: React.ReactNode
  /** Icon-only square button. Defaults to whatever the surrounding list decided. */
  compact?: boolean
}

const AuthProviderButton = React.forwardRef<HTMLButtonElement, AuthProviderButtonProps>(
  ({ provider, label, compact, className, style, type = "button", ...props }, ref) => {
    const fromList = React.useContext(AuthProviderLayoutContext)
    const isCompact = compact ?? fromList
    const id = resolveAuthProvider(provider)
    const Mark = PROVIDER_MARKS[id]
    const name = id === "sso" && provider.trim() ? provider.trim() : PROVIDER_LABEL[id]
    const fallbackLabel = `Continue with ${name}`
    const accessibleName = typeof label === "string" ? label : fallbackLabel

    return (
      <>
        <style href="tesserix-auth-provider-button" precedence="medium">
          {BUTTON_CSS}
        </style>
        <button
          ref={ref}
          type={type}
          data-auth-provider-button={id}
          aria-label={isCompact ? accessibleName : undefined}
          className={cn(
            "relative flex min-h-11 items-center justify-center rounded-xl text-sm font-medium",
            isCompact ? "w-11 flex-none px-0" : "w-full px-12",
            className
          )}
          style={
            {
              background: "var(--auth-input,#FFFFFF)",
              border: "1px solid var(--auth-input-border,rgba(15,23,41,.14))",
              color: "var(--auth-foreground,#0F1729)",
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          <span className={cn("flex items-center", isCompact ? "" : "absolute left-4")}>
            <Mark />
          </span>
          {isCompact ? null : <span className="truncate">{label ?? fallbackLabel}</span>}
        </button>
      </>
    )
  }
)
AuthProviderButton.displayName = "AuthProviderButton"

export { AuthProviderButton, AuthProviderMark }
