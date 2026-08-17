import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { AuthLockoutNotice, AuthPasswordResetRequest, AuthSetPasswordForm } from "./auth-recovery"
import { AuthRegisterForm, type AuthRegisterValues } from "./auth-register-form"

describe("AuthPasswordResetRequest", () => {
  it("asks for whatever identifier the tenant accepts", () => {
    render(
      <AuthPasswordResetRequest
        value=""
        onValueChange={() => {}}
        onSubmit={() => {}}
        methodPolicy={{ allowPhoneLogin: false }}
      />
    )

    expect(screen.getByLabelText("Username or email")).toBeInTheDocument()
  })

  it("submits the identifier", () => {
    const onSubmit = vi.fn()
    render(<AuthPasswordResetRequest value="ada" onValueChange={() => {}} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }))
    expect(onSubmit).toHaveBeenCalledWith("ada")
  })

  it("does not reveal whether the account exists once sent", () => {
    render(<AuthPasswordResetRequest value="ada" onValueChange={() => {}} onSubmit={() => {}} sent />)

    expect(screen.getByRole("status")).toHaveTextContent(/if that account exists/i)
    expect(screen.queryByRole("button", { name: "Send reset link" })).not.toBeInTheDocument()
  })
})

describe("AuthSetPasswordForm", () => {
  const setup = (password: string, confirmPassword: string, onSubmit = vi.fn()) => {
    render(
      <AuthSetPasswordForm
        password={password}
        onPasswordChange={() => {}}
        confirmPassword={confirmPassword}
        onConfirmPasswordChange={() => {}}
        onSubmit={onSubmit}
        passwordPolicy={{ minLength: 8 }}
      />
    )
    return { onSubmit }
  }

  it("blocks submission until the policy is met", () => {
    setup("short", "short")
    expect(screen.getByRole("button", { name: "Save password" })).toBeDisabled()
  })

  it("blocks submission while the confirmation differs", () => {
    setup("longenough1", "longenough2")
    expect(screen.getByRole("button", { name: "Save password" })).toBeDisabled()
    expect(screen.getByRole("alert")).toHaveTextContent("Those passwords don't match.")
  })

  it("stays quiet about a mismatch before the confirmation is typed into", () => {
    setup("longenough1", "")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("submits once compliant and matching", () => {
    const { onSubmit } = setup("longenough1", "longenough1")

    const submit = screen.getByRole("button", { name: "Save password" })
    expect(submit).toBeEnabled()
    fireEvent.click(submit)
    expect(onSubmit).toHaveBeenCalledWith("longenough1")
  })

  it("shows the requirement checklist on both a reset and an invite", () => {
    setup("", "")
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument()
  })
})

describe("AuthLockoutNotice", () => {
  it("says nothing while the account is comfortably far from locking", () => {
    const { container } = render(<AuthLockoutNotice attemptsRemaining={7} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("warns as the threshold approaches", () => {
    render(<AuthLockoutNotice attemptsRemaining={2} />)
    expect(screen.getByRole("alert")).toHaveTextContent("2 attempts remaining")
  })

  it("uses the singular for the last attempt", () => {
    render(<AuthLockoutNotice attemptsRemaining={1} />)
    expect(screen.getByRole("alert")).toHaveTextContent("1 attempt remaining")
  })

  it("explains a lock and offers support when there is somewhere to go", () => {
    render(<AuthLockoutNotice locked supportEmail="help@example.test" />)

    expect(screen.getByRole("alert")).toHaveTextContent(/locked/i)
    expect(screen.getByRole("link", { name: "Contact support" })).toHaveAttribute(
      "href",
      "mailto:help@example.test"
    )
  })
})

describe("AuthRegisterForm", () => {
  const base: AuthRegisterValues = {
    email: "ada@example.test",
    givenName: "Ada",
    familyName: "Lovelace",
    password: "longenough1",
    acceptedTerms: false,
  }

  const setup = (values: Partial<AuthRegisterValues> = {}, props = {}) => {
    const onSubmit = vi.fn()
    render(
      <AuthRegisterForm
        values={{ ...base, ...values }}
        onValuesChange={() => {}}
        onSubmit={onSubmit}
        passwordPolicy={{ minLength: 8 }}
        {...props}
      />
    )
    return { onSubmit }
  }

  it("disappears when the tenant disallows registration", () => {
    const { container } = render(
      <AuthRegisterForm
        values={base}
        onValuesChange={() => {}}
        onSubmit={() => {}}
        methodPolicy={{ allowRegister: false }}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("submits when nothing legal is required", () => {
    const { onSubmit } = setup()

    fireEvent.click(screen.getByRole("button", { name: "Create account" }))
    expect(onSubmit).toHaveBeenCalled()
  })

  it("requires accepting terms when the tenant supplies a terms link", () => {
    setup({}, { legal: { termsUrl: "https://example.test/tos" } })

    expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled()
    expect(screen.getByRole("link", { name: "terms of service" })).toHaveAttribute(
      "href",
      "https://example.test/tos"
    )
  })

  it("enables submission once the terms are accepted", () => {
    setup({ acceptedTerms: true }, { legal: { termsUrl: "https://example.test/tos" } })
    expect(screen.getByRole("button", { name: "Create account" })).toBeEnabled()
  })

  it("links the privacy policy alongside the terms when both exist", () => {
    setup({}, { legal: { termsUrl: "https://example.test/tos", privacyUrl: "https://example.test/privacy" } })

    expect(screen.getByRole("link", { name: "privacy policy" })).toBeInTheDocument()
  })

  it("blocks submission until the password meets the policy", () => {
    setup({ password: "short" })
    expect(screen.getByRole("button", { name: "Create account" })).toBeDisabled()
  })

  it("can collect an email only", () => {
    setup({}, { collectName: false })

    expect(screen.queryByLabelText("First name")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })
})
