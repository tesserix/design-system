import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  AuditLogViewer,
  AuditLogRoot,
  AuditLogHeader,
  AuditLogTitle,
  AuditLogCount,
  AuditLogList,
  AuditLogRow,
  AuditLogSummary,
  AuditLogTime,
} from "./audit-log-viewer"

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
    expect(screen.getByText(/mahesh updated settings/i)).toBeInTheDocument()
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

  it("renders rows as buttons only when onEntrySelect is provided", () => {
    const { rerender } = render(<AuditLogViewer entries={entries} />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()

    rerender(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} />)
    expect(screen.getByRole("button", { name: /mahesh updated settings/i })).toBeInTheDocument()
  })

  it("renders a source via renderSource", () => {
    render(
      <AuditLogViewer
        entries={[{ ...entries[0], source: "mark8ly" }]}
        renderSource={(source) => <span data-testid="source">{source.toUpperCase()}</span>}
      />
    )

    expect(screen.getByTestId("source")).toHaveTextContent("MARK8LY")
  })

  it("ignores renderSource when an entry has no source", () => {
    render(<AuditLogViewer entries={entries} renderSource={(source) => <span data-testid="source">{source}</span>} />)

    expect(screen.queryByTestId("source")).not.toBeInTheDocument()
  })

  it("renders a raw source string when renderSource is omitted", () => {
    render(<AuditLogViewer entries={[{ ...entries[0], source: "mark8ly" }]} />)

    expect(screen.getByText("mark8ly")).toBeInTheDocument()
  })

  it("formats metadata via renderMetadata", () => {
    render(
      <AuditLogViewer
        entries={[{ ...entries[0], metadata: '{"severity":"critical"}' }]}
        renderMetadata={(metadata) => <span data-testid="meta">{JSON.parse(metadata).severity}</span>}
      />
    )

    expect(screen.getByTestId("meta")).toHaveTextContent("critical")
    expect(screen.queryByText('{"severity":"critical"}')).not.toBeInTheDocument()
  })

  it("falls back to raw metadata when renderMetadata is omitted", () => {
    render(<AuditLogViewer entries={[{ ...entries[0], metadata: "Changed payout schedule" }]} />)

    expect(screen.getByText("Changed payout schedule")).toBeInTheDocument()
  })
})

describe("AuditLogViewer parts", () => {
  it("composes an equivalent list from the exported parts", () => {
    render(
      <AuditLogRoot>
        <AuditLogHeader>
          <AuditLogTitle>Audit Log</AuditLogTitle>
          <AuditLogCount>1 entry</AuditLogCount>
        </AuditLogHeader>
        <AuditLogList>
          <AuditLogRow entryId="1">
            <AuditLogSummary>
              Mahesh updated settings
              <AuditLogTime>2026-02-24</AuditLogTime>
            </AuditLogSummary>
          </AuditLogRow>
        </AuditLogList>
      </AuditLogRoot>
    )

    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getByRole("listitem")).toHaveTextContent("Mahesh updated settings")
    expect(screen.getByText("1 entry")).toBeInTheDocument()
  })

  it("exposes the parts as dot-notation aliases on AuditLogViewer", () => {
    expect(AuditLogViewer.Root).toBe(AuditLogRoot)
    expect(AuditLogViewer.Row).toBe(AuditLogRow)
    expect(AuditLogViewer.Summary).toBe(AuditLogSummary)
  })

  it("throws a clear error when a row is used outside a root", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<AuditLogSummary>orphan</AuditLogSummary>)).toThrow(
      /must be used within/i
    )
    spy.mockRestore()
  })
})
