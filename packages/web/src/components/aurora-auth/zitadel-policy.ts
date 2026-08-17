/**
 * Shapes mirroring the Zitadel policies that drive a tenant's login experience.
 *
 * These are deliberately structural, not generated from Zitadel's protobufs: the
 * design system renders what a policy permits and never speaks the protocol. A
 * host maps its own API response onto these and the components follow.
 *
 * Every field is optional. An absent policy means "the platform default", which
 * is what Zitadel itself falls back to when a tenant has not overridden it.
 */

/** Zitadel `LabelPolicy` — the tenant's branding. */
export interface ZitadelLabelPolicy {
  primaryColor?: string
  backgroundColor?: string
  warnColor?: string
  fontColor?: string
  primaryColorDark?: string
  backgroundColorDark?: string
  warnColorDark?: string
  fontColorDark?: string
  logoUrl?: string
  logoUrlDark?: string
  iconUrl?: string
  iconUrlDark?: string
  /** Hides the `@org-domain` suffix on the login name field. */
  hideLoginNameSuffix?: boolean
  /** Removes the "Secured by" platform mark. */
  disableWatermark?: boolean
  themeMode?: "auto" | "light" | "dark"
}

/** Zitadel second-factor types. `otpEmail`/`otpSms` are the code-to-contact factors. */
export type ZitadelSecondFactor = "otp" | "u2f" | "otpEmail" | "otpSms"

/** Zitadel multi-factor types. Today only passwordless/WebAuthn. */
export type ZitadelMultiFactor = "u2fWithPin"

/** Zitadel `PasswordlessType` — whether passkeys are offered at all. */
export type ZitadelPasswordlessType = "notAllowed" | "allowed"

/** Zitadel `LoginPolicy` — which authentication methods a tenant permits. */
export interface ZitadelLoginPolicy {
  allowUsernamePassword?: boolean
  allowRegister?: boolean
  allowExternalIdp?: boolean
  forceMfa?: boolean
  /** Forces MFA for local users only, leaving federated users to their IdP. */
  forceMfaLocalOnly?: boolean
  passwordlessType?: ZitadelPasswordlessType
  hidePasswordReset?: boolean
  /** Never reveal whether a login name exists. */
  ignoreUnknownUsernames?: boolean
  disableLoginWithEmail?: boolean
  disableLoginWithPhone?: boolean
  allowDomainDiscovery?: boolean
  secondFactors?: ZitadelSecondFactor[]
  multiFactors?: ZitadelMultiFactor[]
}

/** Zitadel `PasswordComplexityPolicy` — the rules a new password must satisfy. */
export interface ZitadelPasswordComplexityPolicy {
  minLength?: number
  hasUppercase?: boolean
  hasLowercase?: boolean
  hasNumber?: boolean
  hasSymbol?: boolean
}

/** Zitadel `LockoutPolicy` — attempts before an account locks. */
export interface ZitadelLockoutPolicy {
  maxPasswordAttempts?: number
  maxOtpAttempts?: number
}

/** Zitadel `PrivacyPolicy` — the links a registration form must surface. */
export interface ZitadelPrivacyPolicy {
  tosLink?: string
  privacyLink?: string
  helpLink?: string
  supportEmail?: string
  docsLink?: string
}

/** Everything the login surface needs, in one bag. */
export interface ZitadelPolicies {
  label?: ZitadelLabelPolicy
  login?: ZitadelLoginPolicy
  passwordComplexity?: ZitadelPasswordComplexityPolicy
  lockout?: ZitadelLockoutPolicy
  privacy?: ZitadelPrivacyPolicy
}

const DEFAULT_MIN_LENGTH = 8

export interface PasswordRule {
  id: "minLength" | "uppercase" | "lowercase" | "number" | "symbol"
  label: string
  satisfied: boolean
}

/**
 * Turns a complexity policy into the checklist a password field renders.
 * Only rules the tenant actually requires are returned — an unset policy asks
 * for a minimum length and nothing else, matching Zitadel's own default.
 */
export function evaluatePasswordRules(
  password: string,
  policy: ZitadelPasswordComplexityPolicy = {}
): PasswordRule[] {
  const minLength = policy.minLength && policy.minLength > 0 ? policy.minLength : DEFAULT_MIN_LENGTH
  const rules: PasswordRule[] = [
    {
      id: "minLength",
      label: `At least ${minLength} characters`,
      satisfied: password.length >= minLength,
    },
  ]

  if (policy.hasUppercase) {
    rules.push({ id: "uppercase", label: "An uppercase letter", satisfied: /[A-Z]/.test(password) })
  }
  if (policy.hasLowercase) {
    rules.push({ id: "lowercase", label: "A lowercase letter", satisfied: /[a-z]/.test(password) })
  }
  if (policy.hasNumber) {
    rules.push({ id: "number", label: "A number", satisfied: /[0-9]/.test(password) })
  }
  if (policy.hasSymbol) {
    rules.push({
      id: "symbol",
      label: "A symbol",
      satisfied: /[^A-Za-z0-9]/.test(password),
    })
  }

  return rules
}

export function isPasswordCompliant(
  password: string,
  policy: ZitadelPasswordComplexityPolicy = {}
): boolean {
  return evaluatePasswordRules(password, policy).every((rule) => rule.satisfied)
}

const SECOND_FACTOR_LABEL: Record<ZitadelSecondFactor, string> = {
  otp: "Authenticator app",
  u2f: "Security key",
  otpEmail: "Emailed code",
  otpSms: "Texted code",
}

const SECOND_FACTOR_DESCRIPTION: Record<ZitadelSecondFactor, string> = {
  otp: "Use the code from your authenticator app.",
  u2f: "Use a hardware security key.",
  otpEmail: "We'll email you a one-time code.",
  otpSms: "We'll text you a one-time code.",
}

export function describeSecondFactor(factor: ZitadelSecondFactor): {
  label: string
  description: string
} {
  return {
    label: SECOND_FACTOR_LABEL[factor],
    description: SECOND_FACTOR_DESCRIPTION[factor],
  }
}

/**
 * The login name a tenant will accept, phrased for a placeholder or label.
 * Zitadel can disable email and phone independently.
 */
export function describeLoginName(policy: ZitadelLoginPolicy = {}): string {
  const accepted = ["username"]
  if (!policy.disableLoginWithEmail) accepted.push("email")
  if (!policy.disableLoginWithPhone) accepted.push("phone number")

  if (accepted.length === 1) return "Username"
  if (accepted.length === 2) return `Username or ${accepted[1]}`
  return `Username, ${accepted[1]} or ${accepted[2]}`
}

/** Whether the tenant offers any second factor the UI can present. */
export function hasSecondFactor(policy: ZitadelLoginPolicy = {}): boolean {
  return (policy.secondFactors?.length ?? 0) > 0
}

/** Whether passkeys are on for this tenant. */
export function allowsPasskeys(policy: ZitadelLoginPolicy = {}): boolean {
  return policy.passwordlessType === "allowed"
}
