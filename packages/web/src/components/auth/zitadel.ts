import type {
  AuthBranding,
  AuthLegalLinks,
  AuthMethodPolicy,
  AuthPolicies,
  AuthSecondFactor,
  LockoutPolicy,
  PasswordPolicy,
} from "./auth-policy"

/**
 * Zitadel adapter.
 *
 * Pure mapping functions from Zitadel's policy objects onto the neutral shapes
 * the components consume. Nothing here is imported by a component, so a project
 * on a different identity provider tree-shakes all of it away.
 *
 * The types below are structural rather than generated from Zitadel's protobufs:
 * a host passes whatever its API client returned and only the fields named here
 * are read.
 */

/** Zitadel `LabelPolicy`. */
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
  fontUrl?: string
  hideLoginNameSuffix?: boolean
  disableWatermark?: boolean
  themeMode?: "auto" | "light" | "dark"
}

/** Zitadel second- and multi-factor identifiers. */
export type ZitadelSecondFactor = "otp" | "u2f" | "otpEmail" | "otpSms"
export type ZitadelMultiFactor = "u2fWithPin"
export type ZitadelPasswordlessType = "notAllowed" | "allowed"

/** Zitadel `LoginPolicy`. */
export interface ZitadelLoginPolicy {
  allowUsernamePassword?: boolean
  allowRegister?: boolean
  allowExternalIdp?: boolean
  forceMfa?: boolean
  forceMfaLocalOnly?: boolean
  passwordlessType?: ZitadelPasswordlessType
  hidePasswordReset?: boolean
  ignoreUnknownUsernames?: boolean
  disableLoginWithEmail?: boolean
  disableLoginWithPhone?: boolean
  allowDomainDiscovery?: boolean
  secondFactors?: ZitadelSecondFactor[]
  multiFactors?: ZitadelMultiFactor[]
}

/** Zitadel `PasswordComplexityPolicy`. */
export interface ZitadelPasswordComplexityPolicy {
  minLength?: number
  hasUppercase?: boolean
  hasLowercase?: boolean
  hasNumber?: boolean
  hasSymbol?: boolean
}

/** Zitadel `LockoutPolicy`. */
export interface ZitadelLockoutPolicy {
  maxPasswordAttempts?: number
  maxOtpAttempts?: number
}

/** Zitadel `PrivacyPolicy`. */
export interface ZitadelPrivacyPolicy {
  tosLink?: string
  privacyLink?: string
  helpLink?: string
  supportEmail?: string
  docsLink?: string
}

export interface ZitadelPolicyBundle {
  label?: ZitadelLabelPolicy
  login?: ZitadelLoginPolicy
  passwordComplexity?: ZitadelPasswordComplexityPolicy
  lockout?: ZitadelLockoutPolicy
  privacy?: ZitadelPrivacyPolicy
}

const SECOND_FACTOR: Record<ZitadelSecondFactor, AuthSecondFactor> = {
  otp: "totp",
  u2f: "securityKey",
  otpEmail: "emailCode",
  otpSms: "smsCode",
}

export function zitadelBranding(policy: ZitadelLabelPolicy | undefined): AuthBranding | undefined {
  if (!policy) return undefined

  return {
    light: {
      primary: policy.primaryColor,
      background: policy.backgroundColor,
      font: policy.fontColor,
      warn: policy.warnColor,
    },
    dark: {
      primary: policy.primaryColorDark,
      background: policy.backgroundColorDark,
      font: policy.fontColorDark,
      warn: policy.warnColorDark,
    },
    logoUrl: policy.logoUrl,
    logoUrlDark: policy.logoUrlDark,
    iconUrl: policy.iconUrl,
    iconUrlDark: policy.iconUrlDark,
    hideLoginNameSuffix: policy.hideLoginNameSuffix,
    hideWatermark: policy.disableWatermark,
    themeMode: policy.themeMode,
  }
}

export function zitadelMethodPolicy(policy: ZitadelLoginPolicy | undefined): AuthMethodPolicy | undefined {
  if (!policy) return undefined

  return {
    allowPassword: policy.allowUsernamePassword,
    allowRegister: policy.allowRegister,
    allowExternalIdp: policy.allowExternalIdp,
    allowPasskeys: policy.passwordlessType === "allowed",
    requireMfa: policy.forceMfa,
    requireMfaLocalOnly: policy.forceMfaLocalOnly,
    hidePasswordReset: policy.hidePasswordReset,
    ignoreUnknownUsernames: policy.ignoreUnknownUsernames,
    // Zitadel states these negatively; the neutral shape states them positively
    // so an absent policy stays permissive.
    allowEmailLogin: policy.disableLoginWithEmail === undefined ? undefined : !policy.disableLoginWithEmail,
    allowPhoneLogin: policy.disableLoginWithPhone === undefined ? undefined : !policy.disableLoginWithPhone,
    allowDomainDiscovery: policy.allowDomainDiscovery,
    secondFactors: policy.secondFactors?.map((factor) => SECOND_FACTOR[factor]).filter(Boolean),
  }
}

export function zitadelPasswordPolicy(
  policy: ZitadelPasswordComplexityPolicy | undefined
): PasswordPolicy | undefined {
  if (!policy) return undefined

  return {
    minLength: policy.minLength,
    requireUppercase: policy.hasUppercase,
    requireLowercase: policy.hasLowercase,
    requireNumber: policy.hasNumber,
    requireSymbol: policy.hasSymbol,
  }
}

export function zitadelLockoutPolicy(policy: ZitadelLockoutPolicy | undefined): LockoutPolicy | undefined {
  if (!policy) return undefined
  return { maxPasswordAttempts: policy.maxPasswordAttempts, maxOtpAttempts: policy.maxOtpAttempts }
}

export function zitadelLegalLinks(policy: ZitadelPrivacyPolicy | undefined): AuthLegalLinks | undefined {
  if (!policy) return undefined

  return {
    termsUrl: policy.tosLink,
    privacyUrl: policy.privacyLink,
    helpUrl: policy.helpLink,
    supportEmail: policy.supportEmail,
    docsUrl: policy.docsLink,
  }
}

/** Maps a whole Zitadel policy bundle onto the neutral shapes in one call. */
export function fromZitadel(bundle: ZitadelPolicyBundle): AuthPolicies {
  return {
    branding: zitadelBranding(bundle.label),
    methods: zitadelMethodPolicy(bundle.login),
    password: zitadelPasswordPolicy(bundle.passwordComplexity),
    lockout: zitadelLockoutPolicy(bundle.lockout),
    legal: zitadelLegalLinks(bundle.privacy),
  }
}
