import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Grid } from "./grid"

describe("Grid", () => {
  it("renders grid container", () => {
    const { container } = render(<Grid cols={2}>content</Grid>)
    expect(container.firstChild).toHaveClass("grid")
  })
})
