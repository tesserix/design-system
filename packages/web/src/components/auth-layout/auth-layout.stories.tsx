import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent } from "storybook/test"

import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import {
  AuthCard,
  AuthCardDivider,
  AuthCardDescription,
  AuthCardHeader,
  AuthCardTitle,
  AuthLayout,
  AuthLayoutBrand,
  AuthLayoutContent,
  AuthSocialButton,
  AuthSocialProviders,
} from "./auth-layout"

const meta = {
  title: "Layout/AuthLayout",
  component: AuthLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

const GoogleIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.5-5.5 3.5-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.6-2.5C16.9 2.7 14.7 2 12 2 6.9 2 2.8 6.4 2.8 11.5S6.9 21 12 21c6.9 0 9.1-4.9 9.1-7.4 0-.5 0-.9-.1-1.3H12z" />
  </svg>
)

const GitHubIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2c-3.3.8-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 2.7 3.4 1.9.1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.4-5.5-6.2 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.3 1-.3 2-.4 3-.4 1 0 2 .1 3 .4 2.3-1.6 3.4-1.3 3.4-1.3.7 1.7.3 3 .1 3.3.7.9 1.2 2 1.2 3.4 0 4.8-2.8 5.9-5.5 6.2.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5z" />
  </svg>
)

export const SignIn: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutBrand>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tesserix Platform</p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold tracking-tight">Secure access for your product teams.</h2>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Unified auth patterns for enterprise workspaces with role-aware controls.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Trusted by operations teams in 28 countries.</p>
      </AuthLayoutBrand>

      <AuthLayoutContent>
        <AuthCard>
          <AuthCardHeader>
            <AuthCardTitle>Sign in</AuthCardTitle>
            <AuthCardDescription>Use your workspace credentials to continue.</AuthCardDescription>
          </AuthCardHeader>
          <form className="space-y-4" aria-label="Sign in form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@tesserix.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Continue</Button>
          </form>
        </AuthCard>
      </AuthLayoutContent>
    </AuthLayout>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(canvas.getByRole("heading", { name: /sign in/i })).toBeInTheDocument()
    await expect(canvas.getByRole("form", { name: /sign in form/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /continue/i })).toBeInTheDocument()
  },
}

export const ContentOnly: Story = {
  render: () => (
    <AuthLayout className="lg:grid-cols-1">
      <AuthLayoutContent>
        <AuthCard>
          <AuthCardHeader>
            <AuthCardTitle>Reset password</AuthCardTitle>
            <AuthCardDescription>Enter your email to receive reset instructions.</AuthCardDescription>
          </AuthCardHeader>
          <form className="space-y-4" aria-label="Reset password form">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" placeholder="you@tesserix.com" />
            </div>
            <Button className="w-full">Send reset link</Button>
          </form>
        </AuthCard>
      </AuthLayoutContent>
    </AuthLayout>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(canvas.getByRole("form", { name: /reset password form/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /send reset link/i })).toBeInTheDocument()
  },
}

export const WithSocialLogin: Story = {
  render: () => (
    <AuthLayout>
      <AuthLayoutBrand>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tesserix Platform</p>
          <h2 className="mt-3 max-w-sm text-3xl font-semibold tracking-tight">Use SSO or email to sign in.</h2>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Works with enterprise identity providers and social auth.
          </p>
        </div>
      </AuthLayoutBrand>

      <AuthLayoutContent>
        <AuthCard>
          <AuthCardHeader>
            <AuthCardTitle>Sign in</AuthCardTitle>
            <AuthCardDescription>Continue with your preferred identity provider.</AuthCardDescription>
          </AuthCardHeader>

          <AuthSocialProviders aria-label="Social providers">
            <AuthSocialButton provider="Google" icon={GoogleIcon}>
              Continue with Google
            </AuthSocialButton>
            <AuthSocialButton provider="GitHub" icon={GitHubIcon}>
              Continue with GitHub
            </AuthSocialButton>
          </AuthSocialProviders>

          <AuthCardDivider label="or continue with email" />

          <form className="space-y-4" aria-label="Sign in form">
            <div className="space-y-2">
              <Label htmlFor="social-email">Email</Label>
              <Input id="social-email" type="email" placeholder="you@tesserix.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="social-password">Password</Label>
              <Input id="social-password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full">Continue</Button>
          </form>
        </AuthCard>
      </AuthLayoutContent>
    </AuthLayout>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /continue with google/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /continue with github/i })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: /continue with google/i }))
    await expect(canvas.getByRole("form", { name: /sign in form/i })).toBeInTheDocument()
  },
}

export const SocialButtonModes: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-md space-y-3 p-4">
      <AuthSocialProviders className="grid-cols-3">
        <AuthSocialButton provider="Google" icon={GoogleIcon} display="icon-only" />
        <AuthSocialButton provider="GitHub" display="text-only">
          Continue with GitHub
        </AuthSocialButton>
        <AuthSocialButton provider="Google" icon={GoogleIcon} display="icon-text">
          Continue with Google
        </AuthSocialButton>
      </AuthSocialProviders>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button", { name: /continue with google/i })).toHaveLength(2)
    await expect(canvas.getByRole("button", { name: /continue with github/i })).toBeInTheDocument()
  },
}
