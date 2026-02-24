import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { FilterBuilder } from "./filter-builder"

describe("FilterBuilder", () => {
  const fields = [
    { id: "status", label: "Status" },
    { id: "owner", label: "Owner" },
  ]

  it("adds a rule", () => {
    render(<FilterBuilder fields={fields} />)

    fireEvent.click(screen.getByRole("button", { name: "Add Rule" }))
    expect(screen.getByLabelText("Field")).toBeInTheDocument()
  })

  it("emits value changes", () => {
    const onValueChange = vi.fn()
    render(<FilterBuilder fields={fields} onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Add Rule" }))
    fireEvent.change(screen.getByLabelText("Value"), { target: { value: "alice" } })

    const latest = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]?.[0]
    expect(latest.rules[0].value).toBe("alice")
  })

  it("switches combinator", () => {
    const onValueChange = vi.fn()
    render(<FilterBuilder fields={fields} onValueChange={onValueChange} />)

    fireEvent.change(screen.getByLabelText("Match"), { target: { value: "OR" } })

    const latest = onValueChange.mock.calls[onValueChange.mock.calls.length - 1]?.[0]
    expect(latest.combinator).toBe("OR")
  })
})
