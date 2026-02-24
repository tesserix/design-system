import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Carousel } from "./carousel"

describe("Carousel", () => {
  it("renders first item", () => {
    render(<Carousel items={[<div key="1">One</div>, <div key="2">Two</div>]} />)
    expect(screen.getByText("One")).toBeInTheDocument()
  })

  it("navigates to next item", () => {
    render(<Carousel items={[<div key="1">One</div>, <div key="2">Two</div>]} />)
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("Two")).toBeInTheDocument()
  })
})
