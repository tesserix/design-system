import * as React from "react"

/** Every mark carries explicit width/height: auth screens often ship without our stylesheet. */
export interface ProviderMarkProps {
  size?: number
}

function mark(name: string, size: number, children: React.ReactNode, viewBox = "0 0 24 24") {
  return (
    <svg
      data-provider-mark={name}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
    >
      {children}
    </svg>
  )
}

function GoogleMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "google",
    size,
    <>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 010-4.2V7.07H2.18a11 11 0 000 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </>
  )
}

function MicrosoftMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "microsoft",
    size,
    <>
      <path fill="#F25022" d="M2 2h9.2v9.2H2z" />
      <path fill="#7FBA00" d="M12.8 2H22v9.2h-9.2z" />
      <path fill="#00A4EF" d="M2 12.8h9.2V22H2z" />
      <path fill="#FFB900" d="M12.8 12.8H22V22h-9.2z" />
    </>
  )
}

function AppleMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "apple",
    size,
    <path
      fill="currentColor"
      d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
    />
  )
}

function GithubMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "github",
    size,
    <path
      fill="currentColor"
      d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.9 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.2 4 18.2 4.3 18.2 4.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.9.6A12 12 0 0012 .3z"
    />
  )
}

function GitlabMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "gitlab",
    size,
    <path
      fill="#FC6D26"
      d="M23.96 13.59l-1.35-4.14-2.66-8.19a.46.46 0 00-.87 0L16.42 9.45H7.58L4.92 1.26a.46.46 0 00-.87 0L1.39 9.45.04 13.59a.92.92 0 00.34 1.03L12 23.05l11.63-8.43a.92.92 0 00.33-1.03"
    />
  )
}

function FacebookMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "facebook",
    size,
    <>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.52c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.03 24 18.06 24 12.07z"
      />
      <path
        fill="#FFF"
        d="M16.67 15.54l.53-3.47h-3.33V9.82c0-.94.47-1.87 1.96-1.87h1.52V5c-.01 0-1.39-.24-2.7-.24-2.74 0-4.53 1.66-4.53 4.67v2.64H7.08v3.47h3.05v8.38a12.1 12.1 0 003.75 0v-8.38h2.79z"
      />
    </>
  )
}

function InstagramMark({ size = 20 }: ProviderMarkProps) {
  const gradient = `auth-instagram-${React.useId().replace(/:/g, "")}`
  return mark(
    "instagram",
    size,
    <>
      <defs>
        <radialGradient id={gradient} cx="0.3" cy="1" r="1.2">
          <stop offset="0%" stopColor="#FDD54F" />
          <stop offset="35%" stopColor="#F5643B" />
          <stop offset="70%" stopColor="#D32C7F" />
          <stop offset="100%" stopColor="#7B3FE4" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill={`url(#${gradient})`} />
      <rect x="6.6" y="6.6" width="10.8" height="10.8" rx="4" fill="none" stroke="#FFF" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.9" fill="none" stroke="#FFF" strokeWidth="1.7" />
      <circle cx="17.1" cy="6.9" r="1.05" fill="#FFF" />
    </>
  )
}

function OktaMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "okta",
    size,
    <path
      fill="#007DC1"
      fillRule="evenodd"
      d="M12 1a11 11 0 100 22 11 11 0 000-22zm0 5.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z"
      clipRule="evenodd"
    />
  )
}

function PasskeyMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "passkey",
    size,
    <>
      <circle cx="9.5" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M13.4 14.2A7.6 7.6 0 002 20.2c0 .5.4.8.9.8h8.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="18" cy="12.6" r="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M18 15.6V21l1.6 1.4L21 21l-1.4-1.4L21 18.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </>
  )
}

function SsoMark({ size = 20 }: ProviderMarkProps) {
  return mark(
    "sso",
    size,
    <>
      <path
        d="M12 2.5l7.5 3.2v5.5c0 4.4-3.1 8.3-7.5 9.6-4.4-1.3-7.5-5.2-7.5-9.6V5.7L12 2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9.3 12.1l1.9 2 3.5-3.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

export const PROVIDER_MARKS = {
  google: GoogleMark,
  microsoft: MicrosoftMark,
  apple: AppleMark,
  github: GithubMark,
  gitlab: GitlabMark,
  facebook: FacebookMark,
  instagram: InstagramMark,
  okta: OktaMark,
  passkey: PasskeyMark,
  sso: SsoMark,
} as const

export type AuthProviderId = keyof typeof PROVIDER_MARKS
