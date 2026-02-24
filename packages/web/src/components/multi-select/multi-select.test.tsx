import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { MultiSelect } from "./multi-select"

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
]

describe("MultiSelect", () => {
  it("shows selected count", () => {
    render(<MultiSelect options={options} defaultValue={["react"]} />)
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("calls onValueChange when an option is toggled", () => {
    const onValueChange = vi.fn()
    render(<MultiSelect options={options} onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole("button", { name: /select options/i }))
    fireEvent.click(screen.getByRole("option", { name: /React/i }))

    expect(onValueChange).toHaveBeenCalledWith(["react"])
  })
})
