import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { AuthProviderButton, AuthProviderMark, resolveAuthProvider } from "./auth-provider-button"

describe("resolveAuthProvider", () => {
  it("maps a tenant's display name onto a known brand", () => {
    expect(resolveAuthProvider("Google")).toBe("google")
    expect(resolveAuthProvider("Sign in with Google")).toBe("google")
    expect(resolveAuthProvider("Microsoft Entra ID")).toBe("microsoft")
    expect(resolveAuthProvider("Azure AD")).toBe("microsoft")
    expect(resolveAuthProvider("Meta")).toBe("facebook")
    expect(resolveAuthProvider("facebook")).toBe("facebook")
    expect(resolveAuthProvider("Instagram")).toBe("instagram")
  })

  it("falls back to the generic mark for an IdP it does not know", () => {
    expect(resolveAuthProvider("Northwind Staff Directory")).toBe("sso")
    expect(resolveAuthProvider("")).toBe("sso")
  })
})

describe("AuthProviderButton", () => {
  it("labels a known provider without the host spelling it out", () => {
    render(<AuthProviderButton provider="google" />)

    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument()
  })

  it("paints the brand mark next to the label", () => {
    render(<AuthProviderButton provider="google" />)

    const mark = screen.getByRole("button").querySelector("[data-provider-mark]")
    expect(mark).toHaveAttribute("data-provider-mark", "google")
    expect(mark).toHaveAttribute("aria-hidden", "true")
  })

  it("gives a generic OIDC provider named after a brand that brand's mark", () => {
    render(<AuthProviderButton provider="Google" />)

    const button = screen.getByRole("button", { name: "Continue with Google" })
    expect(button.querySelector("[data-provider-mark]")).toHaveAttribute("data-provider-mark", "google")
  })

  it("keeps an unknown IdP's own name and shows the generic mark", () => {
    render(<AuthProviderButton provider="Northwind Staff Directory" />)

    const button = screen.getByRole("button", { name: "Continue with Northwind Staff Directory" })
    expect(button.querySelector("[data-provider-mark]")).toHaveAttribute("data-provider-mark", "sso")
  })

  it("lets the host override the label", () => {
    render(<AuthProviderButton provider="passkey" label="Use a passkey instead" />)

    expect(screen.getByRole("button", { name: "Use a passkey instead" })).toBeInTheDocument()
  })

  it("keeps an accessible name when compact drops the visible label", () => {
    render(<AuthProviderButton provider="meta" compact />)

    const button = screen.getByRole("button", { name: "Continue with Facebook" })
    expect(button).toHaveTextContent("")
    expect(button.querySelector("[data-provider-mark]")).toBeInTheDocument()
  })

  it("calls onClick and stays a plain button unless asked to submit", async () => {
    const onClick = vi.fn()
    render(<AuthProviderButton provider="github" onClick={onClick} />)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("type", "button")
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("submits its form when the host makes it a submit button", () => {
    render(<AuthProviderButton provider="gitlab" type="submit" />)

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it("does not fire while disabled", async () => {
    const onClick = vi.fn()
    render(<AuthProviderButton provider="apple" onClick={onClick} disabled />)

    await userEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("keeps its own className and forwards a ref", () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<AuthProviderButton ref={ref} provider="okta" className="custom" />)

    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom")
    expect(ref.current).toBe(button)
  })

  it("styles itself from the auth surface so it matches whichever mode the panel is in", () => {
    render(<AuthProviderButton provider="google" />)

    const style = screen.getByRole("button").getAttribute("style") ?? ""
    expect(style).toContain("var(--auth-input")
    expect(style).toContain("var(--auth-foreground")
  })
})

describe("AuthProviderMark", () => {
  it("paints the brand mark for a provider name so hosts can reuse it in their own button", () => {
    render(<AuthProviderMark provider="Google Workspace" size={24} />)

    const mark = document.querySelector("[data-provider-mark]")
    expect(mark).toHaveAttribute("data-provider-mark", "google")
    expect(mark).toHaveAttribute("width", "24")
  })

  it("falls back to the generic sso mark for an unrecognised provider", () => {
    render(<AuthProviderMark provider="Northwind Staff Directory" />)

    expect(document.querySelector("[data-provider-mark]")).toHaveAttribute("data-provider-mark", "sso")
  })
})

describe("resolveAuthProvider prototype safety", () => {
  it("treats an inherited Object key as an unknown IdP name", () => {
    expect(resolveAuthProvider("constructor")).toBe("sso")
    expect(resolveAuthProvider("toString")).toBe("sso")
    expect(resolveAuthProvider("hasOwnProperty")).toBe("sso")
  })

  it("renders an IdP named after an Object prototype key without crashing", () => {
    expect(() => render(<AuthProviderButton provider="constructor" />)).not.toThrow()
  })
})
