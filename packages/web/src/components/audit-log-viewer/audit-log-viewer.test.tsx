import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { AuditLogViewer } from "./audit-log-viewer"

describe("AuditLogViewer", () => {
  const entries = [
    {
      id: "1",
      actor: "Mahesh",
      action: "updated",
      target: "settings",
      timestamp: "2026-02-24",
    },
  ]

  it("renders entries", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.getByRole("button", { name: /mahesh updated settings/i })).toBeInTheDocument()
  })

  it("shows empty state", () => {
    render(<AuditLogViewer entries={[]} emptyMessage="Nothing here" />)
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
  })

  it("calls onEntrySelect", () => {
    const onEntrySelect = vi.fn()
    render(<AuditLogViewer entries={entries} onEntrySelect={onEntrySelect} />)

    fireEvent.click(screen.getByRole("button", { name: /mahesh updated settings/i }))
    expect(onEntrySelect).toHaveBeenCalledWith("1")
  })
})
