import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent } from "storybook/test"

import { Button } from "../button"
import { Input } from "../input"
import { Label } from "../label"
import {
  AuthCard,
  AuthCardCentered,
  AuthCardDivider,
  AuthCardDescription,
  AuthCardFooter,
  AuthCardHeader,
  AuthCardTitle,
  AuthLayout,
  AuthLayoutBackground,
  AuthLayoutBrand,
  AuthLayoutCentered,
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
            <AuthSocialButton provider="Google">
              Continue with Google
            </AuthSocialButton>
            <AuthSocialButton provider="GitHub">
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
        <AuthSocialButton provider="Google" display="icon-only" />
        <AuthSocialButton provider="GitHub" display="text-only">
          Continue with GitHub
        </AuthSocialButton>
        <AuthSocialButton provider="Google" display="icon-text">
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

export const CenteredLayout: Story = {
  render: () => (
    <AuthLayoutCentered>
      <AuthLayoutBackground src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" />
      <AuthCardCentered>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input className="w-full px-3 py-2 border rounded-lg" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter password" />
          </div>
          <button className="w-full py-2 bg-primary text-white rounded-lg">Sign In</button>
        </div>
        <AuthCardFooter>
          <p className="text-xs text-muted-foreground">Powered by Tesserix</p>
        </AuthCardFooter>
      </AuthCardCentered>
    </AuthLayoutCentered>
  ),
}
