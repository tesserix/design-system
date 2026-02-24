import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ComponentPlayground } from "./component-playground"

describe("ComponentPlayground", () => {
  it("renders preview section", () => {
    render(<ComponentPlayground preview={<div>Preview</div>} />)
    expect(screen.getByRole("heading", { name: "Preview" })).toBeInTheDocument()
  })
})
