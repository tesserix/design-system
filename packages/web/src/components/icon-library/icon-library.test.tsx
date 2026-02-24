import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Icon, IconLibrary } from "./icon-library"

describe("IconLibrary", () => {
  it("renders icons", () => {
    render(<IconLibrary />)
    expect(screen.getByText("search")).toBeInTheDocument()
  })

  it("renders a named icon", () => {
    const { container } = render(<Icon name="check" />)
    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
