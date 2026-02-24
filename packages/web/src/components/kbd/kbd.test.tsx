import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Kbd } from "./kbd"

describe("Kbd", () => {
  it("renders keyboard key", () => {
    render(<Kbd>Esc</Kbd>)
    expect(screen.getByText("Esc")).toBeInTheDocument()
  })
})
