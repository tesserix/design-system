import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { TimePicker } from "./time-picker"

describe("TimePicker", () => {
  it("renders time inputs", () => {
    render(<TimePicker />)
    expect(screen.getByLabelText("Hours")).toBeInTheDocument()
    expect(screen.getByLabelText("Minutes")).toBeInTheDocument()
  })

  it("clamps 24h hour and minute values", () => {
    const onChange = vi.fn()
    render(<TimePicker onChange={onChange} />)

    fireEvent.change(screen.getByLabelText("Hours"), { target: { value: "99" } })
    fireEvent.change(screen.getByLabelText("Minutes"), { target: { value: "70" } })

    expect(screen.getByLabelText("Hours")).toHaveValue(23)
    expect(screen.getByLabelText("Minutes")).toHaveValue(59)
    expect(onChange).toHaveBeenCalled()
  })

  it("supports 12h mode with period toggle and seconds", () => {
    const onChange = vi.fn()
    render(<TimePicker format="12h" showSeconds onChange={onChange} value={new Date("2026-01-01T13:10:20")} />)

    fireEvent.change(screen.getByLabelText("Hours"), { target: { value: "11" } })
    fireEvent.change(screen.getByLabelText("Minutes"), { target: { value: "59" } })
    fireEvent.change(screen.getByLabelText("Seconds"), { target: { value: "40" } })
    fireEvent.click(screen.getByRole("button", { name: "Toggle AM/PM" }))

    expect(onChange).toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "Toggle AM/PM" })).toHaveTextContent("AM")
  })

  it("syncs when controlled value changes", () => {
    const { rerender } = render(<TimePicker value={new Date("2026-01-01T09:15:05")} showSeconds />)

    expect(screen.getByLabelText("Hours")).toHaveValue(9)
    expect(screen.getByLabelText("Minutes")).toHaveValue(15)
    expect(screen.getByLabelText("Seconds")).toHaveValue(5)

    rerender(<TimePicker value={new Date("2026-01-01T22:45:35")} showSeconds />)

    expect(screen.getByLabelText("Hours")).toHaveValue(22)
    expect(screen.getByLabelText("Minutes")).toHaveValue(45)
    expect(screen.getByLabelText("Seconds")).toHaveValue(35)
  })

  it("respects disabled state", () => {
    render(<TimePicker format="12h" showSeconds disabled />)

    expect(screen.getByLabelText("Hours")).toBeDisabled()
    expect(screen.getByLabelText("Minutes")).toBeDisabled()
    expect(screen.getByLabelText("Seconds")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Toggle AM/PM" })).toBeDisabled()
  })
})
