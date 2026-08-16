import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { AuroraProviderButton } from "./aurora-provider-button"
import { AuroraProviderList } from "./aurora-provider-list"

describe("AuroraProviderList", () => {
  it("renders nothing when the tenant has no identity provider enabled", () => {
    const { container } = render(<AuroraProviderList label="or sign in with">{[]}</AuroraProviderList>)

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByText("or sign in with")).not.toBeInTheDocument()
  })

  it("ignores providers the tenant switched off rather than leaving a bare divider", () => {
    const googleEnabled = false
    const { container } = render(
      <AuroraProviderList label="or sign in with">
        {googleEnabled && <AuroraProviderButton provider="google" />}
        {null}
      </AuroraProviderList>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("labels the section once the tenant enables a provider", () => {
    render(
      <AuroraProviderList label="or sign in with">
        <AuroraProviderButton provider="google" />
      </AuroraProviderList>
    )

    expect(screen.getByText("or sign in with")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument()
  })

  it("stacks up to three providers with their labels visible", () => {
    render(
      <AuroraProviderList label="OR">
        <AuroraProviderButton provider="google" />
        <AuroraProviderButton provider="microsoft" />
        <AuroraProviderButton provider="apple" />
      </AuroraProviderList>
    )

    expect(screen.getByRole("button", { name: "Continue with Google" })).toHaveTextContent("Continue with Google")
  })

  it("collapses to icon-only buttons past three so a phone shows them in one row", () => {
    render(
      <AuroraProviderList label="OR">
        <AuroraProviderButton provider="google" />
        <AuroraProviderButton provider="microsoft" />
        <AuroraProviderButton provider="apple" />
        <AuroraProviderButton provider="github" />
      </AuroraProviderList>
    )

    const google = screen.getByRole("button", { name: "Continue with Google" })
    expect(google).toHaveTextContent("")
    expect(google.querySelector("[data-provider-mark]")).toBeInTheDocument()
  })

  it("lets a single button opt out of the collapse", () => {
    render(
      <AuroraProviderList label="OR">
        <AuroraProviderButton provider="passkey" compact={false} />
        <AuroraProviderButton provider="google" />
        <AuroraProviderButton provider="microsoft" />
        <AuroraProviderButton provider="apple" />
      </AuroraProviderList>
    )

    expect(screen.getByRole("button", { name: "Continue with a passkey" })).toHaveTextContent(
      "Continue with a passkey"
    )
    expect(screen.getByRole("button", { name: "Continue with Google" })).toHaveTextContent("")
  })
})
