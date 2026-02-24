import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Code } from "./code"

describe("Code", () => {
  it("renders inline code", () => {
    render(<Code>const x = 1</Code>)
    expect(screen.getByText("const x = 1")).toBeInTheDocument()
  })
})
