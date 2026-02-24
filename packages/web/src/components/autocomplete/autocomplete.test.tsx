import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Autocomplete } from "./autocomplete"

const options = [
  { value: "react", label: "React", keywords: ["frontend", "ui"] },
  { value: "vue", label: "Vue", keywords: ["frontend"] },
  { value: "svelte", label: "Svelte", keywords: ["compiler"] },
]

describe("Autocomplete", () => {
  it("filters options from text input and keywords", () => {
    render(<Autocomplete options={options} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "compiler" } })

    expect(screen.getByRole("option", { name: "Svelte" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "React" })).not.toBeInTheDocument()
  })

  it("calls onOptionSelect on option click", () => {
    const onOptionSelect = vi.fn()
    render(<Autocomplete options={options} onOptionSelect={onOptionSelect} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.click(screen.getByRole("option", { name: "React" }))

    expect(onOptionSelect).toHaveBeenCalledWith(options[0])
  })

  it("supports keyboard navigation and enter selection", () => {
    const onOptionSelect = vi.fn()
    render(<Autocomplete options={options} onOptionSelect={onOptionSelect} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onOptionSelect).toHaveBeenCalledWith(options[1])
    expect(input).toHaveValue("Vue")
  })

  it("supports controlled value and maxResults", () => {
    const onValueChange = vi.fn()
    render(
      <Autocomplete
        options={options}
        value="re"
        onValueChange={onValueChange}
        maxResults={1}
      />
    )

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    expect(input).toHaveValue("re")
    expect(screen.getAllByRole("option")).toHaveLength(1)

    fireEvent.change(input, { target: { value: "react" } })
    expect(onValueChange).toHaveBeenCalledWith("react")
  })

  it("renders empty text and closes on escape/outside click", () => {
    render(<Autocomplete options={options} emptyText="Nothing" />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "zzz" } })
    expect(screen.getByText("Nothing")).toBeInTheDocument()

    fireEvent.keyDown(input, { key: "Escape" })
    expect(input).toHaveAttribute("aria-expanded", "false")

    fireEvent.focus(input)
    expect(input).toHaveAttribute("aria-expanded", "true")
    fireEvent.mouseDown(document.body)
    expect(input).toHaveAttribute("aria-expanded", "false")
  })

  it("does not open when disabled", () => {
    render(<Autocomplete options={options} disabled />)
    const input = screen.getByRole("combobox")

    fireEvent.focus(input)

    expect(input).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })
})
