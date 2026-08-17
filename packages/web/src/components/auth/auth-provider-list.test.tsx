import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { AuthProviderButton } from "./auth-provider-button"
import { AuthProviderList } from "./auth-provider-list"

describe("AuthProviderList", () => {
  it("renders nothing when the tenant has no identity provider enabled", () => {
    const { container } = render(<AuthProviderList label="or sign in with">{[]}</AuthProviderList>)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText("or sign in with")).not.toBeInTheDocument()
  })

  it("ignores providers the tenant switched off rather than leaving a bare divider", () => {
    const googleEnabled = false
    const { container } = render(
      <AuthProviderList label="or sign in with">
        {googleEnabled && <AuthProviderButton provider="google" />}
        {null}
      </AuthProviderList>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("labels the section once the tenant enables a provider", () => {
    render(
      <AuthProviderList label="or sign in with">
        <AuthProviderButton provider="google" />
      </AuthProviderList>
    )

    expect(screen.getByText("or sign in with")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument()
  })

  it("stacks up to three providers with their labels visible", () => {
    render(
      <AuthProviderList label="OR">
        <AuthProviderButton provider="google" />
        <AuthProviderButton provider="microsoft" />
        <AuthProviderButton provider="apple" />
      </AuthProviderList>
    )

    expect(screen.getByRole("button", { name: "Continue with Google" })).toHaveTextContent("Continue with Google")
  })

  it("collapses to icon-only buttons past three so a phone shows them in one row", () => {
    render(
      <AuthProviderList label="OR">
        <AuthProviderButton provider="google" />
        <AuthProviderButton provider="microsoft" />
        <AuthProviderButton provider="apple" />
        <AuthProviderButton provider="github" />
      </AuthProviderList>
    )

    const google = screen.getByRole("button", { name: "Continue with Google" })
    expect(google).toHaveTextContent("")
    expect(google.querySelector("[data-provider-mark]")).toBeInTheDocument()
  })

  it("lets a single button opt out of the collapse", () => {
    render(
      <AuthProviderList label="OR">
        <AuthProviderButton provider="passkey" compact={false} />
        <AuthProviderButton provider="google" />
        <AuthProviderButton provider="microsoft" />
        <AuthProviderButton provider="apple" />
      </AuthProviderList>
    )

    expect(screen.getByRole("button", { name: "Continue with a passkey" })).toHaveTextContent(
      "Continue with a passkey"
    )
    expect(screen.getByRole("button", { name: "Continue with Google" })).toHaveTextContent("")
  })
})
