import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AuroraProviderButton, resolveAuroraProvider } from "./aurora-provider-button"

describe("resolveAuroraProvider", () => {
  it("maps a tenant's display name onto a known brand", () => {
    expect(resolveAuroraProvider("Google")).toBe("google")
    expect(resolveAuroraProvider("Sign in with Google")).toBe("google")
    expect(resolveAuroraProvider("Microsoft Entra ID")).toBe("microsoft")
    expect(resolveAuroraProvider("Azure AD")).toBe("microsoft")
    expect(resolveAuroraProvider("Meta")).toBe("facebook")
    expect(resolveAuroraProvider("facebook")).toBe("facebook")
    expect(resolveAuroraProvider("Instagram")).toBe("instagram")
  })

  it("falls back to the generic mark for an IdP it does not know", () => {
    expect(resolveAuroraProvider("Northwind Staff Directory")).toBe("sso")
    expect(resolveAuroraProvider("")).toBe("sso")
  })
})

describe("AuroraProviderButton", () => {
  it("labels a known provider without the host spelling it out", () => {
    render(<AuroraProviderButton provider="google" />)

    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument()
  })

  it("paints the brand mark next to the label", () => {
    render(<AuroraProviderButton provider="google" />)

    const mark = screen.getByRole("button").querySelector("[data-provider-mark]")
    expect(mark).toHaveAttribute("data-provider-mark", "google")
    expect(mark).toHaveAttribute("aria-hidden", "true")
  })

  it("gives a generic OIDC provider named after a brand that brand's mark", () => {
    render(<AuroraProviderButton provider="Google" />)

    const button = screen.getByRole("button", { name: "Continue with Google" })
    expect(button.querySelector("[data-provider-mark]")).toHaveAttribute("data-provider-mark", "google")
  })

  it("keeps an unknown IdP's own name and shows the generic mark", () => {
    render(<AuroraProviderButton provider="Northwind Staff Directory" />)

    const button = screen.getByRole("button", { name: "Continue with Northwind Staff Directory" })
    expect(button.querySelector("[data-provider-mark]")).toHaveAttribute("data-provider-mark", "sso")
  })

  it("lets the host override the label", () => {
    render(<AuroraProviderButton provider="passkey" label="Use a passkey instead" />)

    expect(screen.getByRole("button", { name: "Use a passkey instead" })).toBeInTheDocument()
  })

  it("keeps an accessible name when compact drops the visible label", () => {
    render(<AuroraProviderButton provider="meta" compact />)

    const button = screen.getByRole("button", { name: "Continue with Facebook" })
    expect(button).toHaveTextContent("")
    expect(button.querySelector("[data-provider-mark]")).toBeInTheDocument()
  })

  it("calls onClick and stays a plain button unless asked to submit", async () => {
    const onClick = vi.fn()
    render(<AuroraProviderButton provider="github" onClick={onClick} />)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("submits its form when the host makes it a submit button", () => {
    render(<AuroraProviderButton provider="gitlab" type="submit" />)

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it("does not fire while disabled", async () => {
    const onClick = vi.fn()
    render(<AuroraProviderButton provider="apple" onClick={onClick} disabled />)

    await userEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("keeps its own className and forwards a ref", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<AuroraProviderButton ref={ref} provider="okta" className="custom" />)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom")
    expect(ref.current).toBe(button)
  })

  it("styles itself from the aurora surface so it matches whichever mode the panel is in", () => {
    render(<AuroraProviderButton provider="google" />)

    const style = screen.getByRole("button").getAttribute("style") ?? ""
    expect(style).toContain("var(--aurora-input")
    expect(style).toContain("var(--aurora-foreground")
  })
})
