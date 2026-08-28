import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { ConfirmDialog } from "./confirm-dialog"

const props = {
  open: true,
  onOpenChange: () => {},
  title: "Delete organisation",
  description: "This cannot be undone.",
  onConfirm: () => {},
}

const overlay = () => document.body.querySelector("div.backdrop-blur-sm") as Element
const confirmButton = () => screen.getByRole("button", { name: "Continue" })

describe("ConfirmDialog", () => {
  // The console forked this component to get exactly this: a confirm button
  // associated with a status line saying why it is disabled. A narrow prop
  // means the fork can be deleted rather than drifting from a11y fixes here.
  it("associates the confirm button with a description", () => {
    render(
      <ConfirmDialog {...props} confirmDisabled confirmDescribedBy="why-disabled">
        <p id="why-disabled" role="status">
          Type the organisation name to continue.
        </p>
      </ConfirmDialog>
    )

    expect(confirmButton()).toHaveAttribute("aria-describedby", "why-disabled")
  })

  it("sets no aria-describedby when none is given", () => {
    render(<ConfirmDialog {...props} />)
    expect(confirmButton()).not.toHaveAttribute("aria-describedby")
  })

  // A stray click on the overlay must not abandon a destructive flow — the
  // operator cannot tell afterwards whether they cancelled or mis-clicked.
  // `variant` already defaults to "destructive", so this is the default path.
  it("does not dismiss a destructive confirmation on outside click", () => {
    const onOpenChange = vi.fn()
    render(<ConfirmDialog {...props} onOpenChange={onOpenChange} />)

    fireEvent.mouseDown(overlay())
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("still dismisses a non-destructive confirmation on outside click", () => {
    const onOpenChange = vi.fn()
    render(<ConfirmDialog {...props} variant="default" onOpenChange={onOpenChange} />)

    fireEvent.mouseDown(overlay())
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  // The default is a judgement about destructiveness, not a lock.
  it("lets a caller opt back into dismissal", () => {
    const onOpenChange = vi.fn()
    render(
      <ConfirmDialog {...props} onOpenChange={onOpenChange} dismissOnOutsideClick />
    )

    fireEvent.mouseDown(overlay())
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
