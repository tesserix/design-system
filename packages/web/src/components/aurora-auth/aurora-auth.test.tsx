import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"

import { AuroraAuthPanel, AuroraBackground, useAuroraPalette } from "./aurora-auth"

describe("AuroraAuthPanel", () => {
  it("renders the tenant headline, tagline and form children", () => {
    render(
      <AuroraAuthPanel
        brandColor="#0E9F6E"
        title="Sign in to Northwind Health"
        tagline="Clinical scheduling for 40 sites."
      >
        <button type="submit">Continue</button>
      </AuroraAuthPanel>
    )

    expect(screen.getByRole("heading", { name: "Sign in to Northwind Health" })).toBeInTheDocument()
    expect(screen.getByText("Clinical scheduling for 40 sites.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("omits the heading when the host app renders its own title", () => {
    render(
      <AuroraAuthPanel brandColor="#5B5FD6">
        <h1>Welcome back</h1>
      </AuroraAuthPanel>
    )

    expect(screen.getAllByRole("heading")).toHaveLength(1)
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument()
  })

  it("renders the tenant logo and footer slots", () => {
    render(
      <AuroraAuthPanel
        brandColor="#E8590C"
        title="Kestrel Freight Portal"
        logo={<img src="/kestrel.svg" alt="Kestrel Freight" />}
        footer="Drivers: use the mobile app to sign in."
      />
    )

    expect(screen.getByAltText("Kestrel Freight")).toBeInTheDocument()
    expect(screen.getByText("Drivers: use the mobile app to sign in.")).toBeInTheDocument()
  })

  it("exposes the derived palette to children as CSS custom properties", () => {
    render(
      <AuroraAuthPanel brandColor="#5B5FD6" title="Sign in" data-testid="panel" />
    )

    const panel = screen.getByTestId("panel")
    expect(panel.style.getPropertyValue("--aurora-accent")).toBe("#5B5FD6")
    expect(panel.style.getPropertyValue("--aurora-canvas")).toBe("#FAFBF8")
    expect(panel.style.getPropertyValue("--aurora-button")).toContain("linear-gradient")
  })

  it("guards an unreadable tenant colour before exposing it", () => {
    render(<AuroraAuthPanel brandColor="#FFE066" title="Sign in" data-testid="panel" />)

    expect(screen.getByTestId("panel").style.getPropertyValue("--aurora-accent")).not.toBe("#FFE066")
  })

  it("switches to the dark surface when asked", () => {
    render(<AuroraAuthPanel brandColor="#9333EA" title="Sign in" mode="dark" data-testid="panel" />)

    expect(screen.getByTestId("panel").style.getPropertyValue("--aurora-canvas")).toBe("#0F0E2A")
  })

  it("hides the watermark by default and shows it when the tenant may not remove it", () => {
    const { rerender } = render(<AuroraAuthPanel brandColor="#5B5FD6" title="Sign in" />)
    expect(screen.queryByText("Secured by Tesserix")).not.toBeInTheDocument()

    rerender(<AuroraAuthPanel brandColor="#5B5FD6" title="Sign in" watermark />)
    expect(screen.getByText("Secured by Tesserix")).toBeInTheDocument()
  })

  it("lets the platform relabel the watermark", () => {
    render(<AuroraAuthPanel brandColor="#5B5FD6" title="Sign in" watermark watermarkLabel="Powered by Aurelia" />)

    expect(screen.getByText("Powered by Aurelia")).toBeInTheDocument()
  })

  it("keeps its own className and forwards a ref", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<AuroraAuthPanel ref={ref} brandColor="#5B5FD6" title="Sign in" className="custom" data-testid="panel" />)

    expect(screen.getByTestId("panel")).toHaveClass("custom")
    expect(ref.current).toBe(screen.getByTestId("panel"))
  })
})

describe("AuroraBackground", () => {
  it("paints one layer per derived wash and hides them from assistive tech", () => {
    render(<AuroraBackground brandColor="#5B5FD6" data-testid="bg" />)

    const background = screen.getByTestId("bg")
    expect(background).toHaveAttribute("aria-hidden", "true")
    expect(background.querySelectorAll("[data-aurora-wash]")).toHaveLength(3)
  })

  it("paints no washes at flat intensity", () => {
    render(<AuroraBackground brandColor="#5B5FD6" intensity="flat" data-testid="bg" />)

    expect(screen.getByTestId("bg").querySelectorAll("[data-aurora-wash]")).toHaveLength(0)
  })
})

describe("useAuroraPalette", () => {
  it("gives children inside a panel the guarded accent", () => {
    function Wordmark() {
      const { accent } = useAuroraPalette()
      return <span data-testid="wordmark">{accent}</span>
    }

    render(
      <AuroraAuthPanel brandColor="#FFE066" title="Sign in">
        <Wordmark />
      </AuroraAuthPanel>
    )

    expect(screen.getByTestId("wordmark").textContent).not.toBe("#FFE066")
  })

  it("throws outside a panel rather than returning a silently wrong palette", () => {
    function Orphan() {
      useAuroraPalette()
      return null
    }

    expect(() => render(<Orphan />)).toThrow(/AuroraAuthPanel/)
  })
})
