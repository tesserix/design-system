import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { RichTextEditor } from "./rich-text-editor"

describe("RichTextEditor", () => {
  it("renders editor", () => {
    render(<RichTextEditor />)
    expect(screen.getByRole("textbox")).toBeInTheDocument()
  })

  it("calls onValueChange from content edits", () => {
    const onValueChange = vi.fn()
    render(<RichTextEditor onValueChange={onValueChange} />)

    fireEvent.input(screen.getByRole("textbox"), { target: { innerHTML: "Hello" } })
    expect(onValueChange).toHaveBeenCalledWith("Hello")
  })

  it("runs toolbar commands", () => {
    const onValueChange = vi.fn()
    const execSpy = vi.fn(() => true)
    ;(document as Document & { execCommand: (command: string) => boolean }).execCommand = execSpy

    render(<RichTextEditor defaultValue="<p>Text</p>" onValueChange={onValueChange} />)

    fireEvent.click(screen.getByRole("button", { name: "B" }))
    fireEvent.click(screen.getByRole("button", { name: "I" }))
    fireEvent.click(screen.getByRole("button", { name: "U" }))

    expect(execSpy).toHaveBeenCalledWith("bold")
    expect(execSpy).toHaveBeenCalledWith("italic")
    expect(execSpy).toHaveBeenCalledWith("underline")
    expect(onValueChange).toHaveBeenCalled()
  })

  it("syncs controlled value", () => {
    const { rerender } = render(<RichTextEditor value="<p>First</p>" />)
    expect(screen.getByRole("textbox")).toHaveTextContent("First")

    rerender(<RichTextEditor value="<p>Second</p>" />)
    expect(screen.getByRole("textbox")).toHaveTextContent("Second")
  })
})
