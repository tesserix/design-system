import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Tag } from "./tag"

describe("Tag", () => {
  it("renders label", () => {
    render(<Tag>TypeScript</Tag>)
    expect(screen.getByText("TypeScript")).toBeInTheDocument()
  })

  it("calls onRemove when remove button is clicked", () => {
    const onRemove = vi.fn()
    render(<Tag onRemove={onRemove}>Tag</Tag>)

    fireEvent.click(screen.getByRole("button", { name: "Remove tag" }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
