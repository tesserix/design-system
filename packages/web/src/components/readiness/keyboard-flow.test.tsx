import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "../button"
import { Input } from "../input"

describe("Readiness keyboard flow", () => {
  it("supports keyboard-only tab flow with consistent focus order", async () => {
    const user = userEvent.setup()

    render(
      <form aria-label="Sign in" className="space-y-3">
        <Button type="button" variant="outline">Continue with Google</Button>
        <Button type="button" variant="outline">Continue with GitHub</Button>
        <Input aria-label="Email" type="email" />
        <Input aria-label="Password" type="password" />
        <Button type="submit">Continue</Button>
      </form>
    )

    await user.tab()
    expect(screen.getByRole("button", { name: /continue with google/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole("button", { name: /continue with github/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole("textbox", { name: /email/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByLabelText(/password/i)).toHaveFocus()

    await user.tab()
    expect(screen.getByRole("button", { name: /^continue$/i })).toHaveFocus()
  })
})
