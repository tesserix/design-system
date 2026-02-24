import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Masonry } from "./masonry"

describe("Masonry", () => {
  it("renders all items", () => {
    render(<Masonry items={[<div key="1">A</div>, <div key="2">B</div>]} />)
    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})
