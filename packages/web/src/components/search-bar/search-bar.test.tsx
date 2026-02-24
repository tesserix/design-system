import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { SearchBar } from "./search-bar"

describe("SearchBar", () => {
  it("calls onSearch on submit", () => {
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByRole("searchbox")
    fireEvent.change(input, { target: { value: "button" } })
    fireEvent.submit(input.closest("form")!)

    expect(onSearch).toHaveBeenCalledWith("button")
  })
})
