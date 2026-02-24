import { describe, expect, it } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"

import { Button } from "../button"
import { ToastProvider, ToastViewport, useToast } from "./toast"

const ToastHarness = () => {
  const { toast } = useToast()

  return (
    <Button
      onClick={() =>
        toast({
          title: "Saved",
          description: "Settings updated",
          actionLabel: "Undo",
          onAction: () => {},
          duration: 0,
        })
      }
    >
      Notify
    </Button>
  )
}

describe("Toast", () => {
  it("announces status updates and supports close/action controls", async () => {
    render(
      <ToastProvider>
        <ToastHarness />
        <ToastViewport />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /notify/i }))

    const status = await screen.findByRole("status")
    expect(status).toHaveAttribute("aria-live", "polite")
    expect(status).toHaveTextContent("Saved")
    expect(status).toHaveTextContent("Settings updated")

    fireEvent.click(screen.getByRole("button", { name: /undo/i }))

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })
  })

  it("auto dismisses when duration is positive", async () => {
    const AutoDismissHarness = () => {
      const { toast } = useToast()
      return (
        <Button onClick={() => toast({ title: "Temp", duration: 10 })}>
          Open short toast
        </Button>
      )
    }

    render(
      <ToastProvider>
        <AutoDismissHarness />
        <ToastViewport />
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /open short toast/i }))
    expect(await screen.findByRole("status")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    })
  })
})
