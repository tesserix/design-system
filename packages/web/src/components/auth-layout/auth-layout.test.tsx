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
