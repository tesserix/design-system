import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { PropertyPanel } from "./property-panel"

describe("PropertyPanel", () => {
  const sections = [
    {
      id: "general",
      title: "General",
      fields: [
        { id: "title", label: "Title", editable: true },
        { id: "slug", label: "Slug", editable: false },
      ],
    },
  ]

  it("renders section fields", () => {
    render(<PropertyPanel value={{ title: "Hello", slug: "hello" }} sections={sections} />)
    expect(screen.getByText("General")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Hello")).toBeInTheDocument()
  })

  it("emits updated values", () => {
    const onValueChange = vi.fn()
    render(
      <PropertyPanel
        value={{ title: "Hello", slug: "hello" }}
        sections={sections}
        onValueChange={onValueChange}
      />
    )

    fireEvent.change(screen.getByDisplayValue("Hello"), { target: { value: "Updated" } })
    expect(onValueChange).toHaveBeenCalledWith({ title: "Updated", slug: "hello" })
  })

  it("calls onSave with draft", () => {
    const onSave = vi.fn()
    render(
      <PropertyPanel
        value={{ title: "Hello", slug: "hello" }}
        sections={sections}
        onSave={onSave}
      />
    )

    fireEvent.change(screen.getByDisplayValue("Hello"), { target: { value: "Saved" } })
    fireEvent.click(screen.getByRole("button", { name: "Save" }))

    expect(onSave).toHaveBeenCalledWith({ title: "Saved", slug: "hello" })
  })
})
