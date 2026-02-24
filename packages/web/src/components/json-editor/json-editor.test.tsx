import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { JsonEditor } from "./json-editor"

describe("JsonEditor", () => {
  it("renders initial value", () => {
    render(<JsonEditor value={{ name: "alpha" }} />)
    expect(screen.getByDisplayValue(/"name": "alpha"/)).toBeInTheDocument()
  })

  it("calls onError for invalid JSON", () => {
    const onValidationError = vi.fn()
    render(<JsonEditor value={{ name: "alpha" }} onValidationError={onValidationError} />)

    fireEvent.change(screen.getByLabelText("JSON editor"), { target: { value: "{" } })
    expect(onValidationError).toHaveBeenCalled()
  })

  it("calls onChange when JSON is valid", () => {
    const onChange = vi.fn()
    render(<JsonEditor value={{ name: "alpha" }} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText("JSON editor"), { target: { value: '{"name":"beta"}' } })
    expect(onChange).toHaveBeenCalledWith({ name: "beta" })
  })
})
