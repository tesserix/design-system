import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ScrollArea } from "./scroll-area"

describe("ScrollArea", () => {
  it("renders children", () => {
    render(<ScrollArea>Hello</ScrollArea>)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })
})
