import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { Button } from "../button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../dialog"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { ToastProvider, ToastViewport, useToast } from "../toast"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../tooltip"

const ToastTrigger = () => {
  const { toast } = useToast()

  return (
    <Button onClick={() => toast({ title: "Overlay toast", description: "Layer check", duration: 0 })}>
      Open toast
    </Button>
  )
}

describe("Overlay layering readiness", () => {
  it("renders dialog (portal), popover, tooltip, and toast with stable stacking and no runtime warnings", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    render(
      <ToastProvider>
        <ToastTrigger />
        <ToastViewport data-testid="toast-viewport" />

        <Dialog defaultOpen>
          <DialogTrigger>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog layer</DialogTitle>
            <Popover defaultOpen>
              <PopoverTrigger>Open popover</PopoverTrigger>
              <PopoverContent>Popover layer</PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button">Tooltip trigger</button>
                </TooltipTrigger>
                <TooltipContent>Tooltip layer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogContent>
        </Dialog>
      </ToastProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /open toast/i }))
    fireEvent.focus(screen.getByRole("button", { name: /tooltip trigger/i }))

    const dialog = screen.getByRole("dialog")
    const tooltipEl = await screen.findByRole("tooltip")
    const status = await screen.findByRole("status")
    const popover = screen.getByText("Popover layer")

    expect(dialog.className).toContain("z-50")
    // Radix v1.2+ renders role="tooltip" on a visually-hidden <span>;
    // the z-50 class is on the parent Content element
    const tooltipContent = tooltipEl.parentElement ?? tooltipEl
    expect(tooltipContent.className).toContain("z-50")
    expect(popover.className).toContain("z-50")
    expect(screen.getByTestId("toast-viewport").className).toContain("z-[100]")
    expect(status).toHaveAttribute("aria-live", "polite")

    const runtimeLogs = [...errorSpy.mock.calls, ...warnSpy.mock.calls]
      .map((call) => String(call[0] ?? ""))
      .filter((message) => /hydration|did not match|warning/i.test(message))

    expect(runtimeLogs).toHaveLength(0)

    errorSpy.mockRestore()
    warnSpy.mockRestore()
  })
})
