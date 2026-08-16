"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { AuroraProviderLayoutContext } from "./aurora-provider-list"
import { PROVIDER_MARKS, type AuroraProviderId } from "./provider-marks"

export type { AuroraProviderId }

const PROVIDER_LABEL: Record<AuroraProviderId, string> = {
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
const PROVIDER_ALIAS: Array<[RegExp, AuroraProviderId]> = [
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

export function resolveAuroraProvider(provider: string): AuroraProviderId {
  const name = provider.trim().toLowerCase()
  if (name in PROVIDER_MARKS) return name as AuroraProviderId
  return PROVIDER_ALIAS.find(([pattern]) => pattern.test(name))?.[1] ?? "sso"
}

const BUTTON_CSS = `
[data-aurora-provider-button]{transition:background .15s ease,border-color .15s ease,box-shadow .15s ease}
[data-aurora-provider-button]:hover:not(:disabled){background:var(--aurora-hover,rgba(15,23,41,.045))}
[data-aurora-provider-button]:focus-visible{outline:2px solid var(--aurora-accent,#5B5FD6);outline-offset:2px}
[data-aurora-provider-button]:disabled{opacity:.55;cursor:not-allowed}
`

export interface AuroraProviderButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** A known provider id, or the tenant's IdP display name to resolve one from. */
  provider: AuroraProviderId | (string & {})
  /** Defaults to `Continue with <provider>`. */
  label?: React.ReactNode
  /** Icon-only square button. Defaults to whatever the surrounding list decided. */
  compact?: boolean
}

const AuroraProviderButton = React.forwardRef<HTMLButtonElement, AuroraProviderButtonProps>(
  ({ provider, label, compact, className, style, type = "button", ...props }, ref) => {
    const fromList = React.useContext(AuroraProviderLayoutContext)
    const isCompact = compact ?? fromList
    const id = resolveAuroraProvider(provider)
    const Mark = PROVIDER_MARKS[id]
    const name = id === "sso" && provider.trim() ? provider.trim() : PROVIDER_LABEL[id]
    const fallbackLabel = `Continue with ${name}`
    const accessibleName = typeof label === "string" ? label : fallbackLabel

    return (
      <>
        <style href="tesserix-aurora-provider-button" precedence="medium">
          {BUTTON_CSS}
        </style>
        <button
          ref={ref}
          type={type}
          data-aurora-provider-button={id}
          aria-label={isCompact ? accessibleName : undefined}
          className={cn(
            "relative flex min-h-11 items-center justify-center rounded-xl text-sm font-medium",
            isCompact ? "w-11 flex-none px-0" : "w-full px-12",
            className
          )}
          style={
            {
              background: "var(--aurora-input,#FFFFFF)",
              border: "1px solid var(--aurora-input-border,rgba(15,23,41,.14))",
              color: "var(--aurora-foreground,#0F1729)",
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
AuroraProviderButton.displayName = "AuroraProviderButton"

export { AuroraProviderButton }
