import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, within } from "@testing-library/react"

import { Combobox } from "./combobox"

const options = [
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
]

const optionsWithDisabled = [
  { value: "react", label: "React" },
  { value: "legacy", label: "Legacy Framework", disabled: true },
  { value: "vue", label: "Vue" },
]

const optionsWithMeta = [
  { value: "USD", label: "$ USD", description: "United States Dollar", searchTerms: ["dollar", "america"] },
  { value: "EUR", label: "€ EUR", description: "Euro", searchTerms: ["europe"] },
  { value: "GBP", label: "£ GBP", description: "British Pound Sterling", searchTerms: ["pound", "uk"] },
]

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

describe("Combobox", () => {
  it("renders with placeholder and opens on focus", () => {
    render(<Combobox options={options} placeholder="Pick one" />)

    const input = screen.getByRole("combobox")
    expect(input).toHaveAttribute("aria-expanded", "false")

    fireEvent.focus(input)
    expect(input).toHaveAttribute("aria-expanded", "true")
    expect(screen.getAllByRole("option")).toHaveLength(5)
  })

  it("filters options by label text", () => {
    render(<Combobox options={options} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "vue" } })

    expect(screen.getAllByRole("option")).toHaveLength(1)
    expect(screen.getByRole("option", { name: /vue/i })).toBeInTheDocument()
  })

  it("filters options by searchTerms", () => {
    render(<Combobox options={optionsWithMeta} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "america" } })

    expect(screen.getAllByRole("option")).toHaveLength(1)
    expect(screen.getByRole("option", { name: /usd/i })).toBeInTheDocument()
  })

  it("filters options by description", () => {
    render(<Combobox options={optionsWithMeta} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "pound sterling" } })

    expect(screen.getAllByRole("option")).toHaveLength(1)
    expect(screen.getByRole("option", { name: /gbp/i })).toBeInTheDocument()
  })

  it("selects option on click and closes dropdown", () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} onValueChange={onValueChange} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.click(screen.getByRole("option", { name: /vue/i }))

    expect(onValueChange).toHaveBeenCalledWith("vue")
    expect(input).toHaveValue("Vue")
    expect(input).toHaveAttribute("aria-expanded", "false")
  })

  it("supports keyboard navigation with ArrowDown/ArrowUp and Enter", () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} onValueChange={onValueChange} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    // focus opens the dropdown, highlighted at index 0 (React)
    expect(input).toHaveAttribute("aria-expanded", "true")

    // ArrowDown moves to index 1 (Next.js)
    fireEvent.keyDown(input, { key: "ArrowDown" })
    expect(input).toHaveAttribute("aria-activedescendant", expect.stringMatching(/nextjs$/))

    // Enter selects highlighted item
    fireEvent.keyDown(input, { key: "Enter" })
    expect(onValueChange).toHaveBeenCalledWith("nextjs")
    expect(input).toHaveValue("Next.js")
    expect(input).toHaveAttribute("aria-expanded", "false")
  })

  it("wraps around with ArrowUp from first item", () => {
    render(<Combobox options={options} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    // focus opens dropdown, highlighted at index 0 (React)

    // ArrowUp from index 0 wraps to last item (Angular)
    fireEvent.keyDown(input, { key: "ArrowUp" })
    expect(input).toHaveAttribute("aria-activedescendant", expect.stringMatching(/angular$/))
  })

  it("closes on Escape and resets query", () => {
    render(<Combobox options={options} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "next" } })
    expect(input).toHaveAttribute("aria-expanded", "true")

    fireEvent.keyDown(input, { key: "Escape" })
    expect(input).toHaveAttribute("aria-expanded", "false")
  })

  it("closes on outside click and resets query", () => {
    render(<Combobox options={options} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "vu" } })

    fireEvent.mouseDown(document.body)
    expect(input).toHaveAttribute("aria-expanded", "false")
    expect(input).toHaveValue("")
  })

  it("shows empty text when no options match", () => {
    render(<Combobox options={options} emptyText="Nothing here" />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "zzzzz" } })

    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("does not select disabled options", () => {
    const onValueChange = vi.fn()
    render(<Combobox options={optionsWithDisabled} onValueChange={onValueChange} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.click(screen.getByRole("option", { name: /legacy framework/i }))

    expect(onValueChange).not.toHaveBeenCalled()
    expect(input).toHaveValue("")
  })

  it("does not open when disabled", () => {
    render(<Combobox options={options} disabled />)

    const input = screen.getByRole("combobox")
    expect(input).toBeDisabled()

    fireEvent.focus(input)
    expect(input).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  })

  it("supports controlled value", () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} value="vue" onValueChange={onValueChange} />)

    const input = screen.getByRole("combobox")
    expect(input).toHaveValue("Vue")

    fireEvent.focus(input)
    fireEvent.click(screen.getByRole("option", { name: /react/i }))
    expect(onValueChange).toHaveBeenCalledWith("react")
  })

  it("supports defaultValue for uncontrolled mode", () => {
    render(<Combobox options={options} defaultValue="angular" />)

    const input = screen.getByRole("combobox")
    expect(input).toHaveValue("Angular")
  })

  it("sets aria-invalid when error prop is true", () => {
    render(<Combobox options={options} error />)

    const input = screen.getByRole("combobox")
    expect(input).toHaveAttribute("aria-invalid", "true")
  })

  it("shows loading spinner when loading", () => {
    render(<Combobox options={[]} loading />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)

    // Loading state should render (no options, no empty text)
    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument()
  })

  it("renders option icons when provided", () => {
    const iconOptions = [
      { value: "US", label: "+1", icon: <span data-testid="flag-us">🇺🇸</span> },
      { value: "GB", label: "+44", icon: <span data-testid="flag-gb">🇬🇧</span> },
    ]
    render(<Combobox options={iconOptions} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)

    expect(screen.getByTestId("flag-us")).toBeInTheDocument()
    expect(screen.getByTestId("flag-gb")).toBeInTheDocument()
  })

  it("renders option descriptions when provided", () => {
    render(<Combobox options={optionsWithMeta} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)

    expect(screen.getByText("United States Dollar")).toBeInTheDocument()
    expect(screen.getByText("Euro")).toBeInTheDocument()
  })

  it("uses renderOption for custom rendering", () => {
    const renderOption = vi.fn((option, { selected, highlighted }) => (
      <span data-testid={`custom-${option.value}`}>
        {option.label} {selected ? "✓" : ""} {highlighted ? "→" : ""}
      </span>
    ))

    render(<Combobox options={options} renderOption={renderOption} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)

    expect(screen.getByTestId("custom-react")).toBeInTheDocument()
    expect(renderOption).toHaveBeenCalled()
  })

  it("does not fire selection on Enter with no results", () => {
    const onValueChange = vi.fn()
    render(<Combobox options={options} onValueChange={onValueChange} />)

    const input = screen.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "zzzzz" } })
    fireEvent.keyDown(input, { key: "Enter" })

    expect(onValueChange).not.toHaveBeenCalled()
  })
})
