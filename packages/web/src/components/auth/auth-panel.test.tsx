import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

import { AuthPanel, AuthBackground, useAuthPalette } from "./auth-panel"
import { zitadelBranding } from "./zitadel"

describe("AuthPanel", () => {
  it("renders the tenant headline, tagline and form children", () => {
    render(
      <AuthPanel
        brandColor="#0E9F6E"
        title="Sign in to Northwind Health"
        tagline="Clinical scheduling for 40 sites."
      >
        <button type="submit">Continue</button>
      </AuthPanel>
    )

    expect(screen.getByRole("heading", { name: "Sign in to Northwind Health" })).toBeInTheDocument()
    expect(screen.getByText("Clinical scheduling for 40 sites.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("omits the heading when the host app renders its own title", () => {
    render(
      <AuthPanel brandColor="#5B5FD6">
        <h1>Welcome back</h1>
      </AuthPanel>
    )

    expect(screen.getAllByRole("heading")).toHaveLength(1)
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument()
  })

  it("renders the tenant logo and footer slots", () => {
    render(
      <AuthPanel
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
      <AuthPanel brandColor="#5B5FD6" title="Sign in" data-testid="panel" />
    )

    const panel = screen.getByTestId("panel")
    expect(panel.style.getPropertyValue("--auth-accent")).toBe("#5B5FD6")
    expect(panel.style.getPropertyValue("--auth-canvas")).toBe("var(--background, #F6F6FC)")
    expect(panel.style.getPropertyValue("--auth-button")).toContain("linear-gradient")
  })

  it("guards an unreadable tenant colour before exposing it", () => {
    render(<AuthPanel brandColor="#FFE066" title="Sign in" data-testid="panel" />)

    expect(screen.getByTestId("panel").style.getPropertyValue("--auth-accent")).not.toBe("#FFE066")
  })

  it("switches to the dark surface when asked", () => {
    render(<AuthPanel brandColor="#9333EA" title="Sign in" mode="dark" data-testid="panel" />)

    expect(screen.getByTestId("panel").style.getPropertyValue("--auth-canvas")).toBe("var(--background, #0F0E2A)")
  })

  it("publishes both surfaces at auto so the panel follows the host's dark class", () => {
    const { container } = render(
      <AuthPanel brandColor="#5B5FD6" title="Sign in" mode="auto" data-testid="panel" />
    )

    const css = container.querySelector("style")?.textContent ?? ""
    expect(css).toContain("--auth-canvas:var(--background, #F6F6FC)")
    expect(css).toContain("--auth-canvas:var(--background, #0F0E2A)")
    expect(css).toMatch(/\.dark \[data-auth-scope=/)
  })

  it("scopes the auto stylesheet to its own panel", () => {
    const { container } = render(
      <AuthPanel brandColor="#5B5FD6" title="Sign in" mode="auto" data-testid="panel" />
    )

    const scope = screen.getByTestId("panel").getAttribute("data-auth-scope")
    expect(scope).toBeTruthy()
    expect(container.querySelector("style")?.textContent).toContain(`[data-auth-scope="${scope}"]`)
  })

  it("paints the auto washes from custom properties rather than baked colours", () => {
    render(<AuthPanel brandColor="#5B5FD6" title="Sign in" mode="auto" data-testid="panel" />)

    const washes = screen.getByTestId("panel").querySelectorAll("[data-auth-wash]")
    expect(washes).toHaveLength(3)
    expect(washes[0].getAttribute("style")).toContain("var(--auth-wash-0)")
  })

  it("keeps a fixed mode inline so it never inherits the host's dark class", () => {
    render(<AuthPanel brandColor="#5B5FD6" title="Sign in" mode="light" data-testid="panel" />)

    expect(screen.getByTestId("panel").style.getPropertyValue("--auth-canvas")).toBe("var(--background, #F6F6FC)")
  })

  it("sizes itself to the small viewport so mobile browser chrome cannot clip the card", () => {
    render(<AuthPanel brandColor="#5B5FD6" title="Sign in" data-testid="panel" />)

    expect(screen.getByTestId("panel")).toHaveClass("min-h-[100svh]")
  })

  it("scales its washes to the viewport instead of a desktop pixel size", () => {
    render(<AuthPanel brandColor="#5B5FD6" title="Sign in" data-testid="panel" />)

    const wash = screen.getByTestId("panel").querySelector("[data-auth-wash]")
    expect(wash?.className).toMatch(/vmax/)
  })

  it("hides the watermark by default and shows it when the tenant may not remove it", () => {
    const { rerender } = render(<AuthPanel brandColor="#5B5FD6" title="Sign in" />)
    expect(screen.queryByText("Secured by Tesserix")).not.toBeInTheDocument()

    rerender(<AuthPanel brandColor="#5B5FD6" title="Sign in" watermark />)
    expect(screen.getByText("Secured by Tesserix")).toBeInTheDocument()
  })

  it("lets the platform relabel the watermark", () => {
    render(<AuthPanel brandColor="#5B5FD6" title="Sign in" watermark watermarkLabel="Powered by Aurelia" />)

    expect(screen.getByText("Powered by Aurelia")).toBeInTheDocument()
  })

  it("keeps its own className and forwards a ref", () => {
    const ref = { current: null as HTMLDivElement | null }
    render(<AuthPanel ref={ref} brandColor="#5B5FD6" title="Sign in" className="custom" data-testid="panel" />)

    expect(screen.getByTestId("panel")).toHaveClass("custom")
    expect(ref.current).toBe(screen.getByTestId("panel"))
  })
})

describe("AuthBackground", () => {
  it("paints one layer per derived wash and hides them from assistive tech", () => {
    render(<AuthBackground brandColor="#5B5FD6" data-testid="bg" />)

    const background = screen.getByTestId("bg")
    expect(background).toHaveAttribute("aria-hidden", "true")
    expect(background.querySelectorAll("[data-auth-wash]")).toHaveLength(3)
  })

  it("paints no washes at flat intensity", () => {
    render(<AuthBackground brandColor="#5B5FD6" intensity="flat" data-testid="bg" />)

    expect(screen.getByTestId("bg").querySelectorAll("[data-auth-wash]")).toHaveLength(0)
  })
})

describe("useAuthPalette", () => {
  it("gives children inside a panel the guarded accent", () => {
    function Wordmark() {
      const { accent } = useAuthPalette()
      return <span data-testid="wordmark">{accent}</span>
    }

    render(
      <AuthPanel brandColor="#FFE066" title="Sign in">
        <Wordmark />
      </AuthPanel>
    )

    expect(screen.getByTestId("wordmark").textContent).not.toBe("#FFE066")
  })

  it("throws outside a panel rather than returning a silently wrong palette", () => {
    function Orphan() {
      useAuthPalette()
      return null
    }

    expect(() => render(<Orphan />)).toThrow(/AuthPanel/)
  })
})

describe("AuthPanel brand colour resilience", () => {
  const invalidBrandColors = ["", "   ", "rgb(84,105,212)", "rebeccapurple", "#12", "not-a-colour"]

  it.each(invalidBrandColors)("renders instead of crashing the login page for %j", (brandColor) => {
    expect(() =>
      render(
        <AuthPanel brandColor={brandColor} title="Sign in">
          <button type="button">Continue</button>
        </AuthPanel>
      )
    ).not.toThrow()
  })

  it("still renders the panel's content when the brand colour is unusable", () => {
    render(
      <AuthPanel brandColor="" title="Sign in">
        <button type="button">Continue</button>
      </AuthPanel>
    )

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument()
  })

  it("warns in development so a misconfigured tenant colour is not silent", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<AuthPanel brandColor="rebeccapurple">x</AuthPanel>)

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("rebeccapurple"))
    warn.mockRestore()
  })

  it("keeps painting a valid brand colour exactly as before", () => {
    expect(() => render(<AuthBackground brandColor="#5469D4" />)).not.toThrow()
    expect(() => render(<AuthBackground brandColor="" />)).not.toThrow()
  })
})

describe("AuthPanel theming", () => {
  const styleOf = (container: HTMLElement) =>
    (container.querySelector("[data-auth-scope]") as HTMLElement).getAttribute("style") ?? ""

  it("defers to the host's design tokens when a role is not supplied", () => {
    const { container } = render(<AuthPanel brandColor="#5469D4">x</AuthPanel>)
    const style = styleOf(container)

    expect(style).toContain("var(--background,")
    expect(style).toContain("var(--foreground,")
    expect(style).toContain("var(--muted-foreground,")
  })

  it("keeps the platform default as the token fallback so a standalone page is unchanged", () => {
    const { container } = render(<AuthPanel brandColor="#5469D4">x</AuthPanel>)

    expect(styleOf(container)).toContain("var(--background, #F6F6FC)")
  })

  it("paints a tenant's branding colour literally, overriding the token", () => {
    const { container } = render(
      <AuthPanel brandColor="#5469D4" branding={zitadelBranding({ backgroundColor: "#101820" })}>
        x
      </AuthPanel>
    )
    const style = styleOf(container)

    expect(style).toContain("#101820")
    expect(style).not.toContain("var(--background,")
  })

  it("lets an explicit colours prop beat the label policy", () => {
    const { container } = render(
      <AuthPanel
        brandColor="#5469D4"
        branding={zitadelBranding({ backgroundColor: "#101820" })}
        colors={{ background: "#FFEECC" }}
      >
        x
      </AuthPanel>
    )

    expect(styleOf(container)).toContain("#FFEECC")
  })

  it("exposes radius and font as overridable custom properties", () => {
    const { container } = render(
      <AuthPanel brandColor="#5469D4" metrics={{ radius: "0px", fontFamily: "Inter, sans-serif" }}>
        x
      </AuthPanel>
    )
    const style = styleOf(container)

    expect(style).toContain("--auth-radius: 0px")
    expect(style).toContain("--auth-font: Inter, sans-serif")
  })

  it("defaults radius to the design system's --radius token", () => {
    const { container } = render(<AuthPanel brandColor="#5469D4">x</AuthPanel>)

    expect(styleOf(container)).toContain("var(--radius, 1.25rem)")
  })

  it("honours disableWatermark from the tenant's policy", () => {
    const { rerender } = render(
      <AuthPanel brandColor="#5469D4" watermark watermarkLabel="Secured by Tesserix">
        x
      </AuthPanel>
    )
    expect(screen.getByText("Secured by Tesserix")).toBeInTheDocument()

    rerender(
      <AuthPanel
        brandColor="#5469D4"
        watermark
        watermarkLabel="Secured by Tesserix"
        branding={zitadelBranding({ disableWatermark: true })}
      >
        x
      </AuthPanel>
    )
    expect(screen.queryByText("Secured by Tesserix")).not.toBeInTheDocument()
  })

  it("uses the dark branding variants for the dark half of auto mode", () => {
    const { container } = render(
      <AuthPanel
        brandColor="#5469D4"
        mode="auto"
        branding={zitadelBranding({ backgroundColor: "#FFFFFF", backgroundColorDark: "#101820" })}
      >
        x
      </AuthPanel>
    )
    const css = container.querySelector("style")?.textContent ?? ""

    expect(css).toContain("#FFFFFF")
    expect(css).toContain("#101820")
    expect(css).toMatch(/\.dark \[data-auth-scope/)
  })
})

describe("AuthPanel without a brand colour", () => {
  const styleOf = (container: HTMLElement) =>
    (container.querySelector("[data-auth-scope]") as HTMLElement).getAttribute("style") ?? ""

  it("defers the accent to the design system's primary token", () => {
    const { container } = render(<AuthPanel>x</AuthPanel>)

    expect(styleOf(container)).toContain("var(--primary,")
  })

  it("defers the input border to the input token", () => {
    const { container } = render(<AuthPanel>x</AuthPanel>)

    expect(styleOf(container)).toContain("var(--input,")
  })

  it("paints no washes, so a token-themed surface has no gradient", () => {
    const { container } = render(<AuthPanel>x</AuthPanel>)
    const style = styleOf(container)

    expect(style).toContain("--auth-wash-0: none")
    expect(style).toContain("--auth-wash-1: none")
    expect(style).toContain("--auth-wash-2: none")
  })

  it("does not warn, because omitting the colour is a supported choice", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    render(<AuthPanel>x</AuthPanel>)

    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it("still honours an explicit intensity when no brand colour is given", () => {
    const { container } = render(<AuthPanel intensity="full">x</AuthPanel>)

    expect(styleOf(container)).not.toContain("--auth-wash-0: none")
  })

  it("keeps a supplied brand colour literal, exactly as before", () => {
    const { container } = render(<AuthPanel brandColor="#5469D4">x</AuthPanel>)
    const style = styleOf(container)

    expect(style).toContain("#5469D4")
    expect(style).not.toContain("var(--primary,")
  })
})
