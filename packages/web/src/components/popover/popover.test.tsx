import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "../button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

describe("Popover", () => {
  it("opens and closes via trigger, escape, and outside click", async () => {
    const user = userEvent.setup()

    render(
      <div>
        <button type="button">Outside</button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Popover panel</p>
          </PopoverContent>
        </Popover>
      </div>
    )

    const trigger = screen.getByRole("button", { name: /open popover/i })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(screen.getByText("Popover panel")).toBeInTheDocument()
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByText("Popover panel")).not.toBeInTheDocument()

    await user.click(trigger)
    expect(screen.getByText("Popover panel")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Outside" }))
    expect(screen.queryByText("Popover panel")).not.toBeInTheDocument()
  })

  it("supports controlled mode", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <Popover open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Controlled trigger</PopoverTrigger>
      </Popover>
    )

    await user.click(screen.getByRole("button", { name: /controlled trigger/i }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})
