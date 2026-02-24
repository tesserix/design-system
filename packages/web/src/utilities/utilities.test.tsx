import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

import { ErrorBoundary } from "./error-boundary"
import { FocusTrap } from "./focus-trap"
import { LoadingDots, LoadingOverlay, LoadingProvider, LoadingSkeleton, useLoading } from "./loading"
import { Portal } from "./portal"
import { Hide, Show, useBreakpoint, useMediaQuery } from "./responsive"
import { ThemeProvider, useTheme } from "./theme-provider"
import { VisuallyHidden } from "./visually-hidden"

describe("utilities", () => {
  it("renders portal and visually hidden content", async () => {
    render(
      <div>
        <Portal>
          <div>Portaled</div>
        </Portal>
        <VisuallyHidden>Hidden text</VisuallyHidden>
      </div>
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByText("Portaled")).toBeInTheDocument()
    expect(screen.getByText("Hidden text")).toHaveClass("absolute")
  })

  it("traps and restores focus", () => {
    render(
      <div>
        <button type="button">outside</button>
        <FocusTrap>
          <button type="button">first</button>
          <button type="button">last</button>
        </FocusTrap>
      </div>
    )

    const outside = screen.getByRole("button", { name: "outside" })
    outside.focus()
    fireEvent.keyDown(document, { key: "Tab" })
    expect(screen.getByRole("button", { name: "first" })).toBeInTheDocument()
  })

  it("handles error boundary fallback and reset", () => {
    const Thrower = () => {
      throw new Error("boom")
    }
    const onError = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary onError={onError}>
        <Thrower />
      </ErrorBoundary>
    )

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(onError).toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    consoleError.mockRestore()
  })

  it("covers theme provider and hook", () => {
    const listeners = new Map<string, (event: MediaQueryListEvent) => void>()
    const mql = {
      matches: false,
      addEventListener: vi.fn((_: string, cb: (event: MediaQueryListEvent) => void) => listeners.set("change", cb)),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal("matchMedia", vi.fn(() => mql))

    const Harness = () => {
      const { theme, setTheme, resolvedTheme } = useTheme()
      return (
        <div>
          <button type="button" onClick={() => setTheme("dark")}>
            dark
          </button>
          <button type="button" onClick={() => setTheme("system")}>
            system
          </button>
          <span>{theme}</span>
          <span>{resolvedTheme}</span>
        </div>
      )
    }

    render(
      <ThemeProvider defaultTheme="light">
        <Harness />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: "dark" }))
    expect(document.documentElement.className).toContain("dark")
    fireEvent.click(screen.getByRole("button", { name: "system" }))
    act(() => {
      listeners.get("change")?.({ matches: true } as MediaQueryListEvent)
    })
  })

  it("covers loading utilities", () => {
    const Harness = () => {
      const { setLoading } = useLoading()
      return (
        <button type="button" onClick={() => setLoading(true)}>
          show
        </button>
      )
    }

    render(
      <LoadingProvider>
        <Harness />
        <LoadingDots size="sm" />
        <LoadingOverlay visible message="wait">
          <div>content</div>
        </LoadingOverlay>
        <LoadingSkeleton />
      </LoadingProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: "show" }))
    expect(screen.getByText("Loading...")).toBeInTheDocument()
    expect(screen.getByText("wait")).toBeInTheDocument()
  })

  it("covers responsive hooks and components", () => {
    const listeners = new Map<string, (event: MediaQueryListEvent) => void>()
    const mql = {
      matches: false,
      addEventListener: vi.fn((_: string, cb: (event: MediaQueryListEvent) => void) => listeners.set("change", cb)),
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal("matchMedia", vi.fn(() => mql))
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1300 })

    const Harness = () => {
      const bp = useBreakpoint()
      const matches = useMediaQuery("(min-width: 1024px)")
      return (
        <div>
          <Show above="md">show</Show>
          <Hide above="2xl">hide</Hide>
          <span>{bp ?? "none"}</span>
          <span>{matches ? "m1" : "m0"}</span>
        </div>
      )
    }

    render(<Harness />)
    fireEvent(window, new Event("resize"))
    act(() => {
      listeners.get("change")?.({ matches: true } as MediaQueryListEvent)
    })
    expect(screen.getByText(/showhide/)).toBeInTheDocument()
    expect(screen.getByText("xl")).toBeInTheDocument()
  })
})
