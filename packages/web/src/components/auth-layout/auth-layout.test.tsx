import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  AuthCard,
  AuthCardDescription,
  AuthCardDivider,
  AuthCardHeader,
  AuthCardTitle,
  AuthLayout,
  AuthLayoutBrand,
  AuthLayoutContent,
  AuthSocialButton,
  AuthSocialProviders,
} from "./auth-layout"

describe("AuthLayout", () => {
  it("renders layout primitives and social login actions", () => {
    const onGoogle = vi.fn()

    render(
      <AuthLayout>
        <AuthLayoutBrand>Brand</AuthLayoutBrand>
        <AuthLayoutContent>
          <AuthCard>
            <AuthCardHeader>
              <AuthCardTitle>Sign in</AuthCardTitle>
              <AuthCardDescription>Use your account.</AuthCardDescription>
            </AuthCardHeader>
            <AuthSocialProviders>
              <AuthSocialButton provider="Google" onClick={onGoogle}>
                Continue with Google
              </AuthSocialButton>
              <AuthSocialButton provider="GitHub" disabled>
                Continue with GitHub
              </AuthSocialButton>
            </AuthSocialProviders>
            <AuthCardDivider label="or use email" />
          </AuthCard>
        </AuthLayoutContent>
      </AuthLayout>
    )

    expect(screen.getByText("Brand")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument()
    expect(screen.getByText("Use your account.")).toBeInTheDocument()
    expect(screen.getByText("or use email")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }))
    expect(onGoogle).toHaveBeenCalledTimes(1)

    expect(screen.getByRole("button", { name: /continue with github/i })).toBeDisabled()
  })

  it("paints a brand mark for a known provider without the host supplying one", () => {
    render(<AuthSocialButton provider="Google" />)

    const mark = screen.getByRole("button").querySelector("[data-provider-mark]")
    expect(mark).toHaveAttribute("data-provider-mark", "google")
  })

  it("marks an unknown provider generically rather than leaving a bare label", () => {
    render(<AuthSocialButton provider="Northwind Staff Directory" />)

    expect(
      screen.getByRole("button").querySelector("[data-provider-mark]")
    ).toHaveAttribute("data-provider-mark", "sso")
  })

  it("lets the host's own icon win over the brand mark", () => {
    render(<AuthSocialButton provider="Google" icon={<span data-testid="own-icon">G</span>} />)

    expect(screen.getByTestId("own-icon")).toBeInTheDocument()
    expect(screen.getByRole("button").querySelector("[data-provider-mark]")).toBeNull()
  })

  it("drops the mark when the host asks for a text-only button", () => {
    render(<AuthSocialButton provider="Google" display="text-only" />)

    expect(screen.getByRole("button").querySelector("[data-provider-mark]")).toBeNull()
  })

  it("stacks provider buttons so their labels are never truncated", () => {
    render(<AuthSocialProviders data-testid="providers" />)

    expect(screen.getByTestId("providers")).not.toHaveClass("sm:grid-cols-2")
  })

  it("centres the card header so the title sits over the form", () => {
    render(
      <AuthCardHeader data-testid="header">
        <AuthCardTitle>Sign in</AuthCardTitle>
      </AuthCardHeader>
    )

    expect(screen.getByTestId("header")).toHaveClass("text-center")
  })

  it("hides the brand pane below lg without leaving its grid column behind", () => {
    render(
      <AuthLayout data-testid="layout">
        <AuthLayoutBrand data-testid="brand" />
        <AuthLayoutContent />
      </AuthLayout>
    )

    expect(screen.getByTestId("brand")).toHaveClass("max-lg:hidden")
    expect(screen.getByTestId("brand")).not.toHaveClass("hidden")
  })

  it("centres the card in the viewport on any screen", () => {
    render(<AuthLayoutContent data-testid="content" />)

    const content = screen.getByTestId("content")
    expect(content).toHaveClass("items-center")
    expect(content).toHaveClass("justify-center")
    expect(content).toHaveClass("min-h-[100svh]")
  })

  it("supports icon-only, text-only and icon+text social button modes", () => {
    const onClick = vi.fn()

    render(
      <AuthSocialProviders>
        <AuthSocialButton
          provider="Google"
          icon={<span aria-hidden="true">G</span>}
          display="icon-only"
          onClick={onClick}
        />
        <AuthSocialButton provider="GitHub" display="text-only">
          Continue with GitHub
        </AuthSocialButton>
        <AuthSocialButton provider="Google" icon={<span aria-hidden="true">G</span>} display="icon-text">
          Continue with Google
        </AuthSocialButton>
      </AuthSocialProviders>
    )

    const [iconOnlyButton] = screen.getAllByRole("button", { name: /continue with google/i })
    expect(iconOnlyButton).toBeInTheDocument()
    fireEvent.click(iconOnlyButton)
    expect(onClick).toHaveBeenCalledTimes(1)

    expect(screen.getByRole("button", { name: /continue with github/i })).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: /continue with google/i })).toHaveLength(2)
  })
})
