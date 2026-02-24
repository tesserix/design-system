import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { DateRangePicker } from "./date-range-picker"

describe("DateRangePicker", () => {
  it("renders start and end inputs", () => {
    render(<DateRangePicker />)
    expect(screen.getByLabelText("Start date")).toBeInTheDocument()
    expect(screen.getByLabelText("End date")).toBeInTheDocument()
  })

  it("calls onValueChange", () => {
    const onValueChange = vi.fn()
    render(<DateRangePicker onValueChange={onValueChange} />)

    fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-02-01" } })
    expect(onValueChange).toHaveBeenCalledWith({ start: "2026-02-01" })
  })
})
