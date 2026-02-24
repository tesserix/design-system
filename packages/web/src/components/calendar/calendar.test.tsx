import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Calendar } from "./calendar"

describe("Calendar", () => {
  it("renders without crashing", () => {
    const { container } = render(<Calendar mode="single" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("renders with custom className", () => {
    const { container } = render(
      <Calendar mode="single" className="custom-class" />
    )
    expect(container.querySelector(".custom-class")).toBeInTheDocument()
  })
})
