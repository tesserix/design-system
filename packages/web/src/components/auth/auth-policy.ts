import type { AuthBrandColors } from "./auth-palette"

/**
 * Provider-neutral description of what a tenant's sign-in surface may offer.
 *
 * No component knows which identity provider produced these. An IdP-specific
 * adapter (see `./zitadel`) maps a vendor's policy objects onto these shapes,
 * so supporting another provider never means touching a component.
 *
 * Every field is optional and every default is permissive: an absent policy
 * yields a plain username-and-password form, which is the sensible zero-config
 * behaviour rather than a separate "plain auth" mode.
 */

/** The colours, marks and toggles that make a surface a tenant's own. */
export interface AuthBranding {
  /** Colour roles for the light surface. */
  light?: AuthBrandColors
  /** Colour roles for the dark surface. Each falls back to its light counterpart. */
  dark?: AuthBrandColors
  logoUrl?: string
  logoUrlDark?: string
  iconUrl?: string
  iconUrlDark?: string
  /** Hides the `@org-domain` hint under the login name field. */
  hideLoginNameSuffix?: boolean
  /** Drops the "Secured by" platform mark. */
  hideWatermark?: boolean
  /** Font stack for the surface. */
  fontFamily?: string
  themeMode?: "auto" | "light" | "dark"
}

/** The second factors a surface can present. */
export type AuthSecondFactor = "totp" | "securityKey" | "emailCode" | "smsCode"

/** Which authentication methods a tenant permits. */
export interface AuthMethodPolicy {
  /** Defaults to true. False hides the credential form entirely. */
  allowPassword?: boolean
  /** Defaults to true. */
  allowRegister?: boolean
  allowExternalIdp?: boolean
  /** Whether passwordless/WebAuthn is offered. */
  allowPasskeys?: boolean
  requireMfa?: boolean
  /** Requires MFA for local accounts only, leaving federated users to their IdP. */
  requireMfaLocalOnly?: boolean
  hidePasswordReset?: boolean
  /** Never reveal whether a login name exists. */
  ignoreUnknownUsernames?: boolean
  /** Defaults to true. */
  allowEmailLogin?: boolean
  /** Defaults to true. */
  allowPhoneLogin?: boolean
  allowDomainDiscovery?: boolean
  secondFactors?: AuthSecondFactor[]
}

/** The rules a new password or passphrase must satisfy. */
export interface PasswordPolicy {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumber?: boolean
  requireSymbol?: boolean
}

/** Attempts before an account locks. */
export interface LockoutPolicy {
  maxPasswordAttempts?: number
  maxOtpAttempts?: number
}

/** Links a registration form is obliged to surface. */
export interface AuthLegalLinks {
  termsUrl?: string
  privacyUrl?: string
  helpUrl?: string
  supportEmail?: string
  docsUrl?: string
}

/** Everything a sign-in surface needs, in one bag. */
export interface AuthPolicies {
  branding?: AuthBranding
  methods?: AuthMethodPolicy
  password?: PasswordPolicy
  lockout?: LockoutPolicy
  legal?: AuthLegalLinks
}

const DEFAULT_MIN_LENGTH = 8

export interface PasswordRule {
  id: "minLength" | "uppercase" | "lowercase" | "number" | "symbol"
  label: string
  satisfied: boolean
}

/**
 * Turns a password policy into the checklist a field renders. Only rules the
 * tenant actually requires are returned, so an unset policy asks for a minimum
 * length and nothing else.
 */
export function evaluatePasswordRules(password: string, policy: PasswordPolicy = {}): PasswordRule[] {
  const minLength = policy.minLength && policy.minLength > 0 ? policy.minLength : DEFAULT_MIN_LENGTH
  const rules: PasswordRule[] = [
    {
      id: "minLength",
      label: `At least ${minLength} characters`,
      satisfied: password.length >= minLength,
    },
  ]

  if (policy.requireUppercase) {
    rules.push({ id: "uppercase", label: "An uppercase letter", satisfied: /[A-Z]/.test(password) })
  }
  if (policy.requireLowercase) {
    rules.push({ id: "lowercase", label: "A lowercase letter", satisfied: /[a-z]/.test(password) })
  }
  if (policy.requireNumber) {
    rules.push({ id: "number", label: "A number", satisfied: /[0-9]/.test(password) })
  }
  if (policy.requireSymbol) {
    rules.push({ id: "symbol", label: "A symbol", satisfied: /[^A-Za-z0-9]/.test(password) })
  }

  return rules
}

export function isPasswordCompliant(password: string, policy: PasswordPolicy = {}): boolean {
  return evaluatePasswordRules(password, policy).every((rule) => rule.satisfied)
}

const SECOND_FACTOR_LABEL: Record<AuthSecondFactor, string> = {
  totp: "Authenticator app",
  securityKey: "Security key",
  emailCode: "Emailed code",
  smsCode: "Texted code",
}

const SECOND_FACTOR_DESCRIPTION: Record<AuthSecondFactor, string> = {
  totp: "Use the code from your authenticator app.",
  securityKey: "Use a hardware security key.",
  emailCode: "We'll email you a one-time code.",
  smsCode: "We'll text you a one-time code.",
}

export function describeSecondFactor(factor: AuthSecondFactor): { label: string; description: string } {
  return {
    label: SECOND_FACTOR_LABEL[factor],
    description: SECOND_FACTOR_DESCRIPTION[factor],
  }
}

/** The identifiers a tenant accepts, phrased for a field label. */
export function describeLoginName(policy: AuthMethodPolicy = {}): string {
  const accepted = ["username"]
  if (policy.allowEmailLogin !== false) accepted.push("email")
  if (policy.allowPhoneLogin !== false) accepted.push("phone number")

  if (accepted.length === 1) return "Username"
  if (accepted.length === 2) return `Username or ${accepted[1]}`
  return `Username, ${accepted[1]} or ${accepted[2]}`
}

/** Whether the tenant offers any second factor the UI can present. */
export function hasSecondFactor(policy: AuthMethodPolicy = {}): boolean {
  return (policy.secondFactors?.length ?? 0) > 0
}

/** Whether passkeys are on for this tenant. */
export function allowsPasskeys(policy: AuthMethodPolicy = {}): boolean {
  return policy.allowPasskeys === true
}

/** Colour roles for a surface, with each dark role falling back to its light one. */
export function brandingColors(
  branding: AuthBranding | undefined,
  mode: "light" | "dark" = "light"
): AuthBrandColors {
  if (!branding) return {}
  const light = branding.light ?? {}
  if (mode === "light") return light
  const dark = branding.dark ?? {}
  return {
    primary: dark.primary ?? light.primary,
    background: dark.background ?? light.background,
    font: dark.font ?? light.font,
    warn: dark.warn ?? light.warn,
  }
}
