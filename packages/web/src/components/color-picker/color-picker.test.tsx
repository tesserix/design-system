import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { ColorPicker } from "./color-picker"

describe("ColorPicker", () => {
  it("renders color controls", () => {
    render(<ColorPicker value="#000000" />)
    expect(screen.getByLabelText("Color preview")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("#000000")).toBeInTheDocument()
  })

  it("updates with range and hex inputs", () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#ff0000" onChange={onChange} />)

    const ranges = screen.getAllByRole("slider")
    fireEvent.change(ranges[0], { target: { value: "120" } })
    fireEvent.change(ranges[1], { target: { value: "50" } })
    fireEvent.change(ranges[2], { target: { value: "40" } })
    fireEvent.change(screen.getByPlaceholderText("#000000"), { target: { value: "#00ff00" } })

    expect(onChange).toHaveBeenCalled()
  })

  it("handles disabled and showInput=false", () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#123456" onChange={onChange} disabled showInput={false} />)

    expect(screen.queryByPlaceholderText("#000000")).not.toBeInTheDocument()
    const ranges = screen.getAllByRole("slider")
    ranges.forEach((slider) => expect(slider).toBeDisabled())
  })

  it("ignores invalid hex and syncs controlled value changes", () => {
    const onChange = vi.fn()
    const { rerender } = render(<ColorPicker value="#ff0000" onChange={onChange} />)
    const input = screen.getByPlaceholderText("#000000")

    fireEvent.change(input, { target: { value: "#GGGGGG" } })
    expect(onChange).not.toHaveBeenCalled()

    rerender(<ColorPicker value="#0000ff" onChange={onChange} />)
    expect(screen.getByDisplayValue("#0000ff")).toBeInTheDocument()
  })

  it("covers hue buckets in conversion", () => {
    const onChange = vi.fn()
    render(<ColorPicker value="#ff0000" onChange={onChange} />)

    const hue = screen.getAllByRole("slider")[0]
    ;[10, 80, 140, 210, 280, 350].forEach((v) => {
      fireEvent.change(hue, { target: { value: String(v) } })
    })

    expect(onChange).toHaveBeenCalledTimes(6)
  })
})
