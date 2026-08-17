import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { AuthCredentialForm } from "./auth-credential-form"
import { AuthError, AuthField, AuthInput } from "./auth-field"
import { AuthMfaSelector, AuthOtpStep, AuthPasskeyPrompt } from "./auth-mfa"
import { AuthPasswordField } from "./auth-password-field"

describe("AuthField", () => {
  it("labels its control and wires the hint for a screen reader", () => {
    render(
      <AuthField label="Email" hint="We never share it." htmlFor="email">
        <AuthInput id="email" aria-describedby="email-hint" />
      </AuthField>
    )

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByText("We never share it.")).toHaveAttribute("id", "email-hint")
  })

  it("replaces the hint with an assertive error", () => {
    render(
      <AuthField label="Email" hint="We never share it." error="That address is not valid." htmlFor="email">
        <AuthInput id="email" />
      </AuthField>
    )

    expect(screen.getByRole("alert")).toHaveTextContent("That address is not valid.")
    expect(screen.queryByText("We never share it.")).not.toBeInTheDocument()
  })
})

describe("AuthError", () => {
  it("renders nothing without a message, so callers can pass state straight through", () => {
    const { container } = render(<AuthError />)
    expect(container).toBeEmptyDOMElement()
  })

  it("announces a failure assertively", () => {
    render(<AuthError message="That username and password don't match." />)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })
})

describe("AuthPasswordField", () => {
  const setup = (props: Partial<React.ComponentProps<typeof AuthPasswordField>> = {}) => {
    const onValueChange = vi.fn()
    render(<AuthPasswordField value="" onValueChange={onValueChange} {...props} />)
    return { onValueChange }
  }

  it("masks the value and toggles reveal", () => {
    setup()
    const input = screen.getByLabelText("Password")
    expect(input).toHaveAttribute("type", "password")

    fireEvent.click(screen.getByRole("button", { name: "Show password" }))
    expect(input).toHaveAttribute("type", "text")

    fireEvent.click(screen.getByRole("button", { name: "Hide password" }))
    expect(input).toHaveAttribute("type", "password")
  })

  it("shows no checklist for a sign-in field", () => {
    setup()
    expect(screen.queryByRole("list")).not.toBeInTheDocument()
  })

  it("shows exactly the rules the policy requires", () => {
    setup({ complexityPolicy: { minLength: 10, requireUppercase: true } })

    expect(screen.getByText("At least 10 characters")).toBeInTheDocument()
    expect(screen.getByText("An uppercase letter")).toBeInTheDocument()
    expect(screen.queryByText("A symbol")).not.toBeInTheDocument()
  })

  it("marks a rule met as the value satisfies it", () => {
    const { rerender } = render(
      <AuthPasswordField value="" onValueChange={() => {}} complexityPolicy={{ minLength: 4 }} />
    )
    expect(screen.getByText(/not met yet/)).toBeInTheDocument()

    rerender(<AuthPasswordField value="abcd" onValueChange={() => {}} complexityPolicy={{ minLength: 4 }} />)
    expect(screen.getByText(/— met/)).toBeInTheDocument()
  })

  it("can be relabelled as a passphrase", () => {
    setup({ label: "Passphrase", revealLabel: "Show passphrase" })

    expect(screen.getByLabelText("Passphrase")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Show passphrase" })).toBeInTheDocument()
  })

  it("reports every keystroke", () => {
    const { onValueChange } = setup()
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "hunter2" } })
    expect(onValueChange).toHaveBeenCalledWith("hunter2")
  })
})

describe("AuthCredentialForm", () => {
  const values = { loginName: "", password: "" }

  it("renders a plain username and password form with no policy at all", () => {
    render(<AuthCredentialForm values={values} onValuesChange={() => {}} onSubmit={() => {}} />)

    expect(screen.getByLabelText("Username, email or phone number")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
  })

  it("disappears entirely when the tenant disallows passwords", () => {
    const { container } = render(
      <AuthCredentialForm
        methodPolicy={{ allowPassword: false }}
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("names only the identifiers the tenant accepts", () => {
    render(
      <AuthCredentialForm
        methodPolicy={{ allowPhoneLogin: false }}
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
      />
    )

    expect(screen.getByLabelText("Username or email")).toBeInTheDocument()
  })

  it("hides the reset link when the tenant hides password reset", () => {
    const { rerender } = render(
      <AuthCredentialForm
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
        onForgotPassword={() => {}}
      />
    )
    expect(screen.getByRole("button", { name: "Forgot password?" })).toBeInTheDocument()

    rerender(
      <AuthCredentialForm
        methodPolicy={{ hidePasswordReset: true }}
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
        onForgotPassword={() => {}}
      />
    )
    expect(screen.queryByRole("button", { name: "Forgot password?" })).not.toBeInTheDocument()
  })

  it("hides registration when the tenant disallows it", () => {
    render(
      <AuthCredentialForm
        methodPolicy={{ allowRegister: false }}
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
        onRegister={() => {}}
      />
    )

    expect(screen.queryByRole("button", { name: "Create an account" })).not.toBeInTheDocument()
  })

  it("submits the current values", () => {
    const onSubmit = vi.fn()
    render(
      <AuthCredentialForm
        values={{ loginName: "ada", password: "hunter2" }}
        onValuesChange={() => {}}
        onSubmit={onSubmit}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }))
    expect(onSubmit).toHaveBeenCalledWith({ loginName: "ada", password: "hunter2" })
  })

  it("advances the step instead of submitting in a stepped flow", () => {
    const onSubmit = vi.fn()
    const onStepChange = vi.fn()
    render(
      <AuthCredentialForm
        stepped
        step="loginName"
        onStepChange={onStepChange}
        values={{ loginName: "ada", password: "" }}
        onValuesChange={() => {}}
        onSubmit={onSubmit}
      />
    )

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Continue" }))

    expect(onStepChange).toHaveBeenCalledWith("password")
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("shows the login name suffix unless the tenant hides it", () => {
    const { rerender } = render(
      <AuthCredentialForm
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
        loginNameSuffix="@acme.example"
      />
    )
    expect(screen.getByText("@acme.example")).toBeInTheDocument()

    rerender(
      <AuthCredentialForm
        values={values}
        onValuesChange={() => {}}
        onSubmit={() => {}}
        loginNameSuffix="@acme.example"
        hideLoginNameSuffix
      />
    )
    expect(screen.queryByText("@acme.example")).not.toBeInTheDocument()
  })

  it("blocks a second submit while one is in flight", () => {
    const onSubmit = vi.fn()
    render(<AuthCredentialForm values={values} onValuesChange={() => {}} onSubmit={onSubmit} loading />)

    const submit = screen.getByRole("button", { name: "Please wait…" })
    expect(submit).toBeDisabled()
    fireEvent.click(submit)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

describe("AuthMfaSelector", () => {
  it("renders nothing when the tenant enabled no second factor", () => {
    const { container } = render(<AuthMfaSelector factors={[]} onSelect={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("offers only the factors the tenant enabled", () => {
    render(<AuthMfaSelector factors={["totp", "smsCode"]} onSelect={() => {}} />)

    expect(screen.getByText("Authenticator app")).toBeInTheDocument()
    expect(screen.getByText("Texted code")).toBeInTheDocument()
    expect(screen.queryByText("Security key")).not.toBeInTheDocument()
  })

  it("puts the preferred factor first and marks it", () => {
    render(<AuthMfaSelector factors={["totp", "securityKey"]} preferred="securityKey" onSelect={() => {}} />)

    expect(screen.getAllByRole("button")[0]).toHaveTextContent("Security key")
    expect(screen.getByText("Recommended")).toBeInTheDocument()
  })

  it("reports the chosen factor", () => {
    const onSelect = vi.fn()
    render(<AuthMfaSelector factors={["totp"]} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole("button"))
    expect(onSelect).toHaveBeenCalledWith("totp")
  })
})

describe("AuthOtpStep", () => {
  it("keeps only digits, up to the code length", () => {
    const onValueChange = vi.fn()
    render(<AuthOtpStep value="" onValueChange={onValueChange} onSubmit={() => {}} />)

    fireEvent.change(screen.getByLabelText("Verification code"), { target: { value: "12ab34567" } })
    expect(onValueChange).toHaveBeenCalledWith("123456")
  })

  it("submits itself once the code is complete", () => {
    const onSubmit = vi.fn()
    const { rerender } = render(<AuthOtpStep value="12345" onValueChange={() => {}} onSubmit={onSubmit} />)
    expect(onSubmit).not.toHaveBeenCalled()

    rerender(<AuthOtpStep value="123456" onValueChange={() => {}} onSubmit={onSubmit} />)
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith("123456")
  })

  it("does not resubmit the same code on a re-render", () => {
    const onSubmit = vi.fn()
    const { rerender } = render(<AuthOtpStep value="123456" onValueChange={() => {}} onSubmit={onSubmit} />)
    rerender(<AuthOtpStep value="123456" onValueChange={() => {}} onSubmit={onSubmit} label="Code" />)

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it("describes the factor that produced the code", () => {
    render(<AuthOtpStep value="" onValueChange={() => {}} onSubmit={() => {}} factor="emailCode" />)
    expect(screen.getByText("We'll email you a one-time code.")).toBeInTheDocument()
  })

  it("disables resend until the caller's countdown expires", () => {
    const onResend = vi.fn()
    const { rerender } = render(
      <AuthOtpStep value="" onValueChange={() => {}} onSubmit={() => {}} onResend={onResend} resendIn={20} />
    )
    expect(screen.getByRole("button", { name: /in 20s/ })).toBeDisabled()

    rerender(<AuthOtpStep value="" onValueChange={() => {}} onSubmit={() => {}} onResend={onResend} resendIn={0} />)
    fireEvent.click(screen.getByRole("button", { name: "Send a new code" }))
    expect(onResend).toHaveBeenCalled()
  })
})

describe("AuthPasskeyPrompt", () => {
  it("invites the passkey and offers the password fallback when one exists", () => {
    const onUsePasskey = vi.fn()
    const onUsePassword = vi.fn()
    render(<AuthPasskeyPrompt onUsePasskey={onUsePasskey} onUsePassword={onUsePassword} />)

    fireEvent.click(screen.getByRole("button", { name: "Continue with a passkey" }))
    expect(onUsePasskey).toHaveBeenCalled()

    fireEvent.click(screen.getByRole("button", { name: "Use a password instead" }))
    expect(onUsePassword).toHaveBeenCalled()
  })

  it("omits the password fallback when the tenant has none", () => {
    render(<AuthPasskeyPrompt onUsePasskey={() => {}} />)
    expect(screen.queryByRole("button", { name: "Use a password instead" })).not.toBeInTheDocument()
  })
})
