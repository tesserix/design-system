import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { CommandPalette } from "./command-palette"

describe("CommandPalette", () => {
  it("renders dialog when open", () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        items={[{ id: "1", label: "Open Dashboard" }]}
      />
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })
})
