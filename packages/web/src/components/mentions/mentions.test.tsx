import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Mentions } from "./mentions"

describe("Mentions", () => {
  it("shows suggestions when typing @", () => {
    render(<Mentions options={[{ id: "1", label: "mahesh" }]} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "@m" } })
    expect(screen.getByRole("button", { name: "mahesh" })).toBeInTheDocument()
  })

  it("calls onMentionSelect", () => {
    const onMentionSelect = vi.fn()
    render(
      <Mentions
        options={[{ id: "1", label: "mahesh" }]}
        onMentionSelect={onMentionSelect}
      />
    )

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "@m" } })
    fireEvent.click(screen.getByRole("button", { name: "mahesh" }))
    expect(onMentionSelect).toHaveBeenCalledWith({ id: "1", label: "mahesh" })
  })
})
