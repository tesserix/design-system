import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { MarkdownEditor } from "./markdown-editor"

describe("MarkdownEditor", () => {
  it("renders preview", () => {
    render(<MarkdownEditor defaultValue="# Title" />)
    expect(screen.getByText("Preview")).toBeInTheDocument()
  })

  it("renders markdown preview formatting", () => {
    render(<MarkdownEditor defaultValue={`# Heading\n**Bold** and *Italic*`} />)

    expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeInTheDocument()
    expect(screen.getByText("Bold").tagName.toLowerCase()).toBe("strong")
    expect(screen.getByText("Italic").tagName.toLowerCase()).toBe("em")
  })

  it("updates uncontrolled value and calls onValueChange", () => {
    const onValueChange = vi.fn()
    render(<MarkdownEditor defaultValue="" onValueChange={onValueChange} placeholder="Type markdown" />)

    const textarea = screen.getByPlaceholderText("Type markdown")
    fireEvent.change(textarea, { target: { value: "## Section" } })

    expect(onValueChange).toHaveBeenCalledWith("## Section")
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toBeInTheDocument()
  })

  it("supports controlled value", () => {
    const onValueChange = vi.fn()
    render(<MarkdownEditor value="# Controlled" onValueChange={onValueChange} />)

    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveValue("# Controlled")

    fireEvent.change(textarea, { target: { value: "# Next" } })
    expect(onValueChange).toHaveBeenCalledWith("# Next")
  })
})
