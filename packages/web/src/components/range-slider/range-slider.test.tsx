import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { RangeSlider } from "./range-slider"

describe("RangeSlider", () => {
  it("renders slider handles", () => {
    render(<RangeSlider />)
    expect(screen.getByLabelText("Minimum value")).toBeInTheDocument()
    expect(screen.getByLabelText("Maximum value")).toBeInTheDocument()
  })

  it("updates value via drag and track click", () => {
    const onChange = vi.fn()
    render(<RangeSlider min={0} max={100} defaultValue={[20, 80]} onChange={onChange} />)

    const minHandle = screen.getByLabelText("Minimum value")
    const maxHandle = screen.getByLabelText("Maximum value")
    const track = minHandle.parentElement as HTMLDivElement
    track.getBoundingClientRect = () =>
      ({
        left: 0,
        width: 200,
        top: 0,
        right: 200,
        bottom: 10,
        height: 10,
      }) as DOMRect

    fireEvent.mouseDown(minHandle, { clientX: 40 })
    fireEvent.mouseMove(document, { clientX: 60 })
    fireEvent.mouseUp(document)

    fireEvent.click(track, { clientX: 170, target: track })
    expect(onChange).toHaveBeenCalled()
    expect(maxHandle).toHaveAttribute("aria-valuenow")
  })

  it("supports controlled mode and max handle dragging", () => {
    const onChange = vi.fn()
    const { rerender } = render(<RangeSlider min={0} max={100} value={[10, 90]} onChange={onChange} />)

    const maxHandle = screen.getByLabelText("Maximum value")
    const track = maxHandle.parentElement as HTMLDivElement
    track.getBoundingClientRect = () =>
      ({ left: 0, width: 100, top: 0, right: 100, bottom: 10, height: 10 }) as DOMRect

    fireEvent.mouseDown(maxHandle, { clientX: 90 })
    fireEvent.mouseMove(document, { clientX: 40 })
    fireEvent.mouseUp(document)

    expect(onChange).toHaveBeenCalled()
    rerender(<RangeSlider min={0} max={100} value={[20, 70]} onChange={onChange} />)
    expect(screen.getByLabelText("Minimum value")).toHaveAttribute("aria-valuenow", "20")
  })

  it("does not react when disabled or clicking child element", () => {
    const onChange = vi.fn()
    render(<RangeSlider disabled defaultValue={[10, 90]} onChange={onChange} />)

    const minHandle = screen.getByLabelText("Minimum value")
    const track = minHandle.parentElement as HTMLDivElement
    fireEvent.mouseDown(minHandle, { clientX: 20 })
    fireEvent.mouseMove(document, { clientX: 40 })
    fireEvent.mouseUp(document)

    const child = track.querySelector(".bg-primary") as Element
    fireEvent.click(track, { clientX: 50, target: child })
    expect(onChange).not.toHaveBeenCalled()
    expect(minHandle).toHaveAttribute("tabindex", "-1")
  })

  it("hides labels when configured", () => {
    render(<RangeSlider showLabels={false} />)
    expect(screen.queryByText("0")).not.toBeInTheDocument()
    expect(screen.queryByText("100")).not.toBeInTheDocument()
  })
})
