import type { Meta, StoryObj } from "@storybook/react"

import { AuthPanel, useAuthPalette } from "./auth-panel"
import { AuthProviderButton } from "./auth-provider-button"
import { AuthProviderList } from "./auth-provider-list"

const meta = {
  title: "Patterns/AuthPanel",
  component: AuthPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "White-label sign-in surface. The auth washes are derived from the tenant's primary colour — hue +38° and −42° — so a tenant supplies one colour, not three, and no two tenants land on the same background. The accent is lifted until it reads AA against its own card.",
      },
    },
  },
  argTypes: {
    mode: { control: "inline-radio", options: ["light", "dark", "auto"] },
    intensity: { control: "inline-radio", options: ["subtle", "full", "flat"] },
  },
} satisfies Meta<typeof AuthPanel>

export default meta
type Story = StoryObj<typeof meta>

function Wordmark({ name, glyph }: { name: string; glyph: React.ReactNode }) {
  const { accent, mode, foreground } = useAuthPalette()
  const color = mode === "dark" ? foreground : accent
  return (
    <svg viewBox="0 0 240 34" width="230" height="34" role="img" aria-label={name}>
      <g fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round">
        {glyph}
      </g>
      <text x="44" y="24" fontSize="19" fontWeight="650" letterSpacing="-0.3" fill={color}>
        {name}
      </text>
    </svg>
  )
}

/** `providers` mirrors what the tenant enabled in Zitadel — an empty list renders no section at all. */
function SignInForm({ email, providers = [] }: { email: string; providers?: string[] }) {
  const palette = useAuthPalette()
  const field = {
    background: "var(--auth-input)",
    border: "var(--auth-border)",
    color: "var(--auth-foreground)",
  }

  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <label className="block text-[0.8125rem] font-medium" style={{ color: palette.labelForeground }}>
        Email
        <input
          type="email"
          defaultValue={email}
          className="mt-1.5 w-full rounded-[0.625rem] px-3.5 py-2.5 text-[0.9375rem] outline-none"
          style={field}
        />
      </label>
      <label className="block text-[0.8125rem] font-medium" style={{ color: palette.labelForeground }}>
        Password
        <input
          type="password"
          className="mt-1.5 w-full rounded-[0.625rem] px-3.5 py-2.5 text-[0.9375rem] outline-none"
          style={field}
        />
      </label>
      <div className="flex items-center justify-between text-[0.8125rem]">
        <label className="flex items-center gap-2" style={{ color: palette.mutedForeground }}>
          <input type="checkbox" defaultChecked /> Remember me
        </label>
        <a href="#" className="font-medium" style={{ color: "var(--auth-accent)" }}>
          Forgot password?
        </a>
      </div>
      <button
        type="submit"
        className="w-full rounded-[0.625rem] py-3 text-[0.9375rem] font-semibold"
        style={{
          background: "var(--auth-button)",
          color: "var(--auth-button-foreground)",
          boxShadow: "var(--auth-button-shadow)",
        }}
      >
        Continue
      </button>
      <AuthProviderList label="or continue with">
        {providers.map((provider) => (
          <AuthProviderButton key={provider} provider={provider} />
        ))}
      </AuthProviderList>
    </form>
  )
}

export const Default: Story = {
  args: {
    brandColor: "#5B5FD6",
    mode: "light",
    intensity: "full",
    title: "Sign in to Tesserix",
    tagline: "Welcome back. Please enter your details.",
    footer: "Don't have an account? Sign up",
    children: <SignInForm email="samyak@tesserix.app" providers={["passkey", "google"]} />,
  },
}

export const FollowsHostTheme: Story = {
  args: {
    brandColor: "#5B5FD6",
    mode: "auto",
    title: "Sign in to Tesserix",
    tagline: "Toggle the Storybook theme — the panel follows without a repaint.",
    children: <SignInForm email="samyak@tesserix.app" providers={["passkey", "google"]} />,
  },
}

export const NorthwindHealth: Story = {
  args: {
    brandColor: "#0E9F6E",
    title: "Sign in to Northwind Health",
    tagline: "Clinical scheduling for 40 sites.",
    footer: "Trouble signing in? Contact your IT desk.",
    watermark: true,
    logo: (
      <Wordmark
        name="Northwind"
        glyph={
          <>
            <path d="M17 4 L28 11 L28 24 L17 31 L6 24 L6 11 Z" />
            <path d="M17 12 v11 M11.5 17.5 h11" />
          </>
        }
      />
    ),
    children: <SignInForm email="j.okafor@northwind.health" providers={["microsoft"]} />,
  },
}

export const KestrelFreightDark: Story = {
  args: {
    brandColor: "#E8590C",
    mode: "dark",
    title: "Kestrel Freight Portal",
    tagline: "Track loads, lanes and settlements.",
    footer: "Drivers: use the mobile app to sign in.",
    watermark: true,
    logo: (
      <Wordmark
        name="Kestrel"
        glyph={
          <>
            <path d="M5 24 L15 8 L25 24" />
            <path d="M11 24 L17 14 L23 24" />
          </>
        }
      />
    ),
    children: <SignInForm email="dispatch@kestrelfreight.com" providers={["okta", "google", "github", "apple"]} />,
  },
}

export const AureliaBankSubtle: Story = {
  args: {
    brandColor: "#9333EA",
    mode: "dark",
    intensity: "subtle",
    title: "Aurelia Online Banking",
    tagline: "Your accounts, wherever you are.",
    footer: "Never share your one-time code with anyone.",
    children: <SignInForm email="m.laurent@aurelia.bank" providers={["Aurelia Staff SSO"]} />,
  },
}

export const Flat: Story = {
  args: {
    ...Default.args,
    intensity: "flat",
    tagline: "Auth off — for tenants who want a plain surface.",
  },
}

export const NoProvidersEnabled: Story = {
  args: {
    ...Default.args,
    tagline: "The tenant has no IdP configured — no divider, no dead social button.",
    children: <SignInForm email="samyak@tesserix.app" />,
  },
}

export const OnPhone: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  args: {
    ...Default.args,
    tagline: "Four providers collapse into one tappable row.",
    children: (
      <SignInForm email="samyak@tesserix.app" providers={["google", "microsoft", "apple", "github"]} />
    ),
  },
}

export const UnreadableTenantColour: Story = {
  args: {
    ...Default.args,
    brandColor: "#FFE066",
    title: "Contrast guard",
    tagline: "The tenant picked #FFE066; links and text are darkened until they pass AA.",
  },
}
