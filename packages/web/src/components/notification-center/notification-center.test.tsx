import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { NotificationCenter } from "./notification-center"

describe("NotificationCenter", () => {
  it("shows title", () => {
    render(<NotificationCenter items={[{ id: "1", title: "Alert" }]} />)
    expect(screen.getByText(/Notifications/)).toBeInTheDocument()
  })

  it("calls onMarkRead when a notification is clicked", () => {
    const onMarkRead = vi.fn()
    render(<NotificationCenter items={[{ id: "1", title: "Alert" }]} onMarkRead={onMarkRead} />)
    fireEvent.click(screen.getByRole("button", { name: "Alert" }))
    expect(onMarkRead).toHaveBeenCalledWith("1")
  })
})
