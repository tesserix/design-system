export { AuthPanel, AuthBackground, useAuthPalette, AUTH_FALLBACK_BRAND } from "./auth-panel"
export type {
  AuthPanelProps,
  AuthBackgroundProps,
  AuthSuppliedRoles,
  AuthMetrics,
} from "./auth-panel"
export { AuthProviderButton, AuthProviderMark, resolveAuthProvider } from "./auth-provider-button"
export type { AuthProviderButtonProps, AuthProviderId, AuthProviderMarkProps } from "./auth-provider-button"
export { AuthProviderList } from "./auth-provider-list"
export type { AuthProviderListProps } from "./auth-provider-list"
export { deriveAuthPalette } from "./auth-palette"
export type {
  AuthPalette,
  AuthPaletteOptions,
  AuthSurfaceTheme,
  AuthIntensity,
  AuthBrandColors,
} from "./auth-palette"

// Provider-neutral policy shapes every auth component consumes.
export {
  evaluatePasswordRules,
  isPasswordCompliant,
  describeSecondFactor,
  describeLoginName,
  hasSecondFactor,
  allowsPasskeys,
  brandingColors,
} from "./auth-policy"
export type {
  AuthBranding,
  AuthMethodPolicy,
  AuthSecondFactor,
  PasswordPolicy,
  LockoutPolicy,
  AuthLegalLinks,
  AuthPolicies,
  PasswordRule,
} from "./auth-policy"

// Zitadel adapter. Pure mapping functions; tree-shaken away when unused.
export {
  fromZitadel,
  zitadelBranding,
  zitadelMethodPolicy,
  zitadelPasswordPolicy,
  zitadelLockoutPolicy,
  zitadelLegalLinks,
} from "./zitadel"
export type {
  ZitadelLabelPolicy,
  ZitadelLoginPolicy,
  ZitadelPasswordComplexityPolicy,
  ZitadelLockoutPolicy,
  ZitadelPrivacyPolicy,
  ZitadelPolicyBundle,
  ZitadelSecondFactor,
  ZitadelMultiFactor,
  ZitadelPasswordlessType,
} from "./zitadel"

// Form surface.
export {
  AuthField,
  AuthInput,
  AuthSubmitButton,
  AuthLinkButton,
  AuthError,
} from "./auth-field"
export type {
  AuthFieldProps,
  AuthInputProps,
  AuthSubmitButtonProps,
  AuthLinkButtonProps,
  AuthErrorProps,
} from "./auth-field"
export { AuthPasswordField } from "./auth-password-field"
export type { AuthPasswordFieldProps } from "./auth-password-field"
export { AuthCredentialForm } from "./auth-credential-form"
export type { AuthCredentialFormProps, AuthCredentialValues } from "./auth-credential-form"
export { AuthMfaSelector, AuthOtpStep, AuthPasskeyPrompt } from "./auth-mfa"
export type { AuthMfaSelectorProps, AuthOtpStepProps, AuthPasskeyPromptProps } from "./auth-mfa"
export { AuthRegisterForm } from "./auth-register-form"
export type { AuthRegisterFormProps, AuthRegisterValues } from "./auth-register-form"
export { AuthPasswordResetRequest, AuthSetPasswordForm, AuthLockoutNotice } from "./auth-recovery"
export type {
  AuthPasswordResetRequestProps,
  AuthSetPasswordFormProps,
  AuthLockoutNoticeProps,
} from "./auth-recovery"
