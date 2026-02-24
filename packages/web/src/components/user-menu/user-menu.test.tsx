import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { UserMenu } from "./user-menu"

describe("UserMenu", () => {
  it("renders avatar trigger", () => {
    render(<UserMenu name="Jane Doe" />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
