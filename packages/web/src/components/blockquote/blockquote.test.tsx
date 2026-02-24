import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Blockquote } from "./blockquote"

describe("Blockquote", () => {
  it("renders quote text", () => {
    render(<Blockquote>Quote text</Blockquote>)
    expect(screen.getByText("Quote text")).toBeInTheDocument()
  })
})
