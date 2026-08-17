import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { AuthPanel } from "./auth-panel"
import { AuthCredentialForm, type AuthCredentialValues } from "./auth-credential-form"
import { AuthMfaSelector, AuthOtpStep, AuthPasskeyPrompt } from "./auth-mfa"
import { AuthLockoutNotice, AuthPasswordResetRequest, AuthSetPasswordForm } from "./auth-recovery"
import { AuthRegisterForm, type AuthRegisterValues } from "./auth-register-form"
import { AuthProviderButton } from "./auth-provider-button"
import { AuthProviderList } from "./auth-provider-list"
import { fromZitadel } from "./zitadel"

const BRAND = "#5469D4"

const meta = {
  title: "Patterns/AuthForms",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Policy-driven sign-in forms. Every policy field is optional, so with nothing supplied you get a plain username-and-password form; feeding a provider's policy through an adapter such as `fromZitadel` is what turns on passkeys, second factors, registration and the rest. No component knows which identity provider produced the policy.",
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * No `brandColor`: the surface takes its accent, background, text and radius
 * from the host's design tokens and paints no washes. This is the default the
 * forms are shown against, because most products want their own theme rather
 * than a tenant's brand.
 */
function Surface({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <AuthPanel title={title} tagline="Welcome back.">
      {children}
    </AuthPanel>
  )
}

/**
 * The white-label case: a tenant supplies a brand colour, so the accent, input
 * border, button gradient and the three washes are all derived from it.
 */
export const BrandedTenant: Story = {
  render: function BrandedTenantStory() {
    const [values, setValues] = React.useState<AuthCredentialValues>({ loginName: "", password: "" })
    return (
      <AuthPanel brandColor={BRAND} title="Sign in" tagline="Welcome back.">
        <AuthCredentialForm values={values} onValuesChange={setValues} onSubmit={() => {}} />
      </AuthPanel>
    )
  },
}

/** No policy at all — the zero-config default. */
export const PlainSignIn: Story = {
  render: function PlainSignInStory() {
    const [values, setValues] = React.useState<AuthCredentialValues>({ loginName: "", password: "" })
    return (
      <Surface title="Sign in">
        <AuthCredentialForm values={values} onValuesChange={setValues} onSubmit={() => {}} />
      </Surface>
    )
  },
}

/** The same component, driven by a tenant's Zitadel policy. */
export const ZitadelDriven: Story = {
  render: function ZitadelDrivenStory() {
    const [values, setValues] = React.useState<AuthCredentialValues>({ loginName: "", password: "" })
    const policies = fromZitadel({
      label: { primaryColor: BRAND, hideLoginNameSuffix: false },
      login: {
        allowUsernamePassword: true,
        allowRegister: true,
        disableLoginWithPhone: true,
        hidePasswordReset: false,
        passwordlessType: "allowed",
        secondFactors: ["otp", "otpSms"],
      },
      passwordComplexity: { minLength: 12, hasUppercase: true, hasNumber: true, hasSymbol: true },
    })

    return (
      <AuthPanel brandColor={BRAND} branding={policies.branding} title="Sign in" tagline="Welcome back.">
        <AuthCredentialForm
          methodPolicy={policies.methods}
          values={values}
          onValuesChange={setValues}
          onSubmit={() => {}}
          onForgotPassword={() => {}}
          onRegister={() => {}}
          loginNameSuffix="@acme.example"
        />
        <AuthProviderList label="or continue with">
          <AuthProviderButton provider="google" />
          <AuthProviderButton provider="Microsoft Entra ID" />
        </AuthProviderList>
      </AuthPanel>
    )
  },
}

/** Two-step: identifier first, so the host can branch to an IdP or a passkey. */
export const SteppedSignIn: Story = {
  render: function SteppedSignInStory() {
    const [values, setValues] = React.useState<AuthCredentialValues>({ loginName: "", password: "" })
    const [step, setStep] = React.useState<"loginName" | "password">("loginName")

    return (
      <Surface title="Sign in">
        <AuthCredentialForm
          stepped
          step={step}
          onStepChange={setStep}
          values={values}
          onValuesChange={setValues}
          onSubmit={() => {}}
        />
      </Surface>
    )
  },
}

export const SecondFactorChoice: Story = {
  render: () => (
    <Surface title="Confirm it's you">
      <AuthMfaSelector
        factors={["totp", "securityKey", "emailCode", "smsCode"]}
        preferred="totp"
        onSelect={() => {}}
      />
    </Surface>
  ),
}

export const OneTimeCode: Story = {
  render: function OneTimeCodeStory() {
    const [code, setCode] = React.useState("")
    return (
      <Surface title="Check your phone">
        <AuthOtpStep
          value={code}
          onValueChange={setCode}
          onSubmit={() => {}}
          factor="smsCode"
          onResend={() => {}}
          resendIn={0}
          onUseAnotherMethod={() => {}}
        />
      </Surface>
    )
  },
}

export const Passkey: Story = {
  render: () => (
    <Surface title="Sign in">
      <AuthPasskeyPrompt onUsePasskey={() => {}} onUsePassword={() => {}} />
    </Surface>
  ),
}

export const Register: Story = {
  render: function RegisterStory() {
    const [values, setValues] = React.useState<AuthRegisterValues>({
      email: "",
      givenName: "",
      familyName: "",
      password: "",
      acceptedTerms: false,
    })

    return (
      <Surface title="Create your account">
        <AuthRegisterForm
          values={values}
          onValuesChange={setValues}
          onSubmit={() => {}}
          passwordPolicy={{ minLength: 12, requireUppercase: true, requireNumber: true }}
          legal={{ termsUrl: "https://example.test/tos", privacyUrl: "https://example.test/privacy" }}
          onSignIn={() => {}}
        />
      </Surface>
    )
  },
}

export const ResetPassword: Story = {
  render: function ResetPasswordStory() {
    const [value, setValue] = React.useState("")
    return (
      <Surface>
        <AuthPasswordResetRequest value={value} onValueChange={setValue} onSubmit={() => {}} onBack={() => {}} />
      </Surface>
    )
  },
}

export const SetNewPassword: Story = {
  render: function SetNewPasswordStory() {
    const [password, setPassword] = React.useState("")
    const [confirm, setConfirm] = React.useState("")

    return (
      <Surface>
        <AuthSetPasswordForm
          password={password}
          onPasswordChange={setPassword}
          confirmPassword={confirm}
          onConfirmPasswordChange={setConfirm}
          onSubmit={() => {}}
          passwordPolicy={{ minLength: 12, requireUppercase: true, requireSymbol: true }}
        />
      </Surface>
    )
  },
}

export const LockoutWarning: Story = {
  render: function LockoutWarningStory() {
    const [values, setValues] = React.useState<AuthCredentialValues>({ loginName: "ada", password: "" })
    return (
      <Surface title="Sign in">
        <div className="flex flex-col gap-4">
          <AuthLockoutNotice attemptsRemaining={2} />
          <AuthCredentialForm
            values={values}
            onValuesChange={setValues}
            onSubmit={() => {}}
            error="That username and password don't match."
          />
        </div>
      </Surface>
    )
  },
}

export const SmokeTest: Story = {
  render: PlainSignIn.render,
  play: async ({ canvas }: { canvas: ReturnType<typeof within> }) => {
    const password = canvas.getByLabelText("Password")
    await expect(password).toHaveAttribute("type", "password")

    fireEvent.click(canvas.getByRole("button", { name: "Show password" }))

    // A real browser does not flush React's state update synchronously the way
    // jsdom's act()-wrapped fireEvent does, so the reveal has to be awaited.
    await waitFor(() => expect(password).toHaveAttribute("type", "text"))
  },
}
