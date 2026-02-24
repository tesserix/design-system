import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Rating } from "./rating"

describe("Rating", () => {
  it("renders rating stars", () => {
    render(<Rating value={3} />)
    expect(screen.getByLabelText("Rate 1 star")).toBeInTheDocument()
    expect(screen.getByLabelText("Rate 5 stars")).toBeInTheDocument()
  })
})
