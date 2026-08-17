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

describe("AuditLogViewer labels and headings", () => {
  const entries = [
    {
      id: "1",
      actor: "Mahesh",
      action: "updated",
      target: "settings",
      timestamp: "2026-02-24",
    },
  ]

  it("pluralizes the entry count", () => {
    const { rerender } = render(<AuditLogViewer entries={[]} />)
    expect(screen.getByText("0 entries")).toBeInTheDocument()

    rerender(<AuditLogViewer entries={entries} />)
    expect(screen.getByText("1 entry")).toBeInTheDocument()

    rerender(<AuditLogViewer entries={[entries[0], { ...entries[0], id: "2" }]} />)
    expect(screen.getByText("2 entries")).toBeInTheDocument()
  })

  it("renders an h3 heading by default", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.getByRole("heading", { level: 3, name: "Audit Log" })).toBeInTheDocument()
  })

  it("honours headingLevel", () => {
    render(<AuditLogViewer entries={entries} headingLevel={2} />)
    expect(screen.getByRole("heading", { level: 2, name: "Audit Log" })).toBeInTheDocument()
  })

  it("labels the entry list with the heading", () => {
    render(<AuditLogViewer entries={entries} />)
    const heading = screen.getByRole("heading", { name: "Audit Log" })
    expect(screen.getByRole("list")).toHaveAttribute("aria-labelledby", heading.id)
    expect(heading.id).toBeTruthy()
  })

  it("overrides every string via labels", () => {
    render(
      <AuditLogViewer
        entries={[]}
        labels={{
          title: "Journal d'audit",
          countLabel: (count) => `${count} entrée(s)`,
          empty: "Aucune entrée",
        }}
      />
    )
    expect(screen.getByRole("heading", { name: "Journal d'audit" })).toBeInTheDocument()
    expect(screen.getByText("0 entrée(s)")).toBeInTheDocument()
    expect(screen.getByText("Aucune entrée")).toBeInTheDocument()
  })

  it("prefers the legacy emptyMessage prop over labels.empty", () => {
    render(<AuditLogViewer entries={[]} emptyMessage="Nothing here" labels={{ empty: "ignored" }} />)
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
    expect(screen.queryByText("ignored")).not.toBeInTheDocument()
  })
})

describe("AuditLogViewer time and summary", () => {
  const entries = [
    {
      id: "1",
      actor: "Mahesh",
      action: "updated",
      target: "settings",
      timestamp: "2026-02-24",
    },
  ]

  it("sets dateTime on the time element when supplied", () => {
    render(
      <AuditLogViewer
        entries={[{ ...entries[0], timestamp: "24 Feb 2026", dateTime: "2026-02-24T09:12:00Z" }]}
      />
    )
    const time = screen.getByText("24 Feb 2026")
    expect(time.tagName).toBe("TIME")
    expect(time).toHaveAttribute("datetime", "2026-02-24T09:12:00Z")
  })

  it("omits the dateTime attribute entirely when not supplied", () => {
    render(<AuditLogViewer entries={entries} />)
    expect(screen.getByText("2026-02-24")).not.toHaveAttribute("datetime")
  })

  it("renders a custom summary via renderSummary", () => {
    render(
      <AuditLogViewer
        entries={entries}
        renderSummary={(entry) => <span data-testid="summary">{entry.action.toUpperCase()}</span>}
      />
    )
    expect(screen.getByTestId("summary")).toHaveTextContent("UPDATED")
    expect(screen.queryByText(/mahesh updated settings/i)).not.toBeInTheDocument()
  })

  it("wraps long metadata instead of overflowing", () => {
    render(<AuditLogViewer entries={[{ ...entries[0], metadata: "x".repeat(400) }]} />)
    expect(screen.getByText("x".repeat(400))).toHaveClass("break-words")
  })
})

describe("AuditLogViewer focus and selection", () => {
  const entries = [
    {
      id: "1",
      actor: "Mahesh",
      action: "updated",
      target: "settings",
      timestamp: "2026-02-24",
    },
  ]

  it("gives a selectable row a visible focus ring", () => {
    render(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} />)
    expect(screen.getByRole("button")).toHaveClass("focus-visible:ring-2")
  })

  it("marks the selected entry with aria-current", () => {
    render(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} selectedEntryId="1" />)
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "true")
  })

  it("leaves unselected entries without aria-current", () => {
    render(<AuditLogViewer entries={entries} onEntrySelect={vi.fn()} selectedEntryId="other" />)
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-current")
  })
})
