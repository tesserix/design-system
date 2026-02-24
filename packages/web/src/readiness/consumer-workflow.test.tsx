import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  AuthCard,
  AuthCardDescription,
  AuthCardHeader,
  AuthCardTitle,
  AuthLayout,
  AuthLayoutContent,
  AuthSocialButton,
  Button,
  DashboardLayout,
  DashboardLayoutBody,
  DashboardLayoutHeader,
  DashboardLayoutMain,
  Input,
} from "../index"

describe("Consumer workflow readiness", () => {
  it("validates a consumer auth flow using public exports", async () => {
    const user = userEvent.setup()

    render(
      <AuthLayout>
        <AuthLayoutContent>
          <AuthCard>
            <AuthCardHeader>
              <AuthCardTitle>Sign in</AuthCardTitle>
              <AuthCardDescription>Continue with your preferred identity provider.</AuthCardDescription>
            </AuthCardHeader>

            <div className="grid gap-2 sm:grid-cols-2">
              <AuthSocialButton provider="Google" display="icon-only" icon={<span>G</span>} />
              <AuthSocialButton provider="GitHub" display="text-only" />
            </div>

            <form className="mt-4 space-y-3" aria-label="auth-form">
              <Input aria-label="Email" />
              <Input aria-label="Password" type="password" />
              <Button type="submit">Continue</Button>
            </form>
          </AuthCard>
        </AuthLayoutContent>
      </AuthLayout>
    )

    await user.tab()
    expect(screen.getByRole("button", { name: /continue with google/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole("button", { name: /continue with github/i })).toHaveFocus()

    await user.type(screen.getByRole("textbox", { name: /email/i }), "consumer@tesserix.com")
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("consumer@tesserix.com")
  })

  it("validates a consumer dashboard layout flow using public exports", async () => {
    const user = userEvent.setup()
    const onRefresh = vi.fn()

    render(
      <DashboardLayout>
        <DashboardLayoutHeader>
          <Button onClick={onRefresh}>Refresh</Button>
        </DashboardLayoutHeader>
        <DashboardLayoutBody>
          <DashboardLayoutMain>
            <h2>Overview</h2>
            <p>Revenue summary</p>
          </DashboardLayoutMain>
        </DashboardLayoutBody>
      </DashboardLayout>
    )

    expect(screen.getByText("Overview")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Refresh" }))
    expect(onRefresh).toHaveBeenCalledTimes(1)

  })
})
