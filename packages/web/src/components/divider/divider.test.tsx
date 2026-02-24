import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Divider } from "./divider"

describe("Divider", () => {
  it("renders separator role when decorative is false", () => {
    render(<Divider decorative={false} />)
    expect(screen.getByRole("separator")).toBeInTheDocument()
  })
})
