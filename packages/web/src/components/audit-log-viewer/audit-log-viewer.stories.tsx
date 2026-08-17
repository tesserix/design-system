import type { Meta, StoryObj } from "@storybook/react"
import { expect, fn, userEvent, within } from "storybook/test"

import { AuditLogViewer } from "./audit-log-viewer"

const meta = {
  title: "Patterns/AuditLogViewer",
  component: AuditLogViewer,
  tags: ["autodocs"],
  args: {
    entries: [
      {
        id: "1",
        actor: "Mahesh",
        action: "updated",
        target: "billing settings",
        timestamp: "2026-02-24 09:12 UTC",
        metadata: "Changed payout schedule",
      },
      {
        id: "2",
        actor: "System",
        action: "rotated",
        target: "API key",
        timestamp: "2026-02-24 11:30 UTC",
      },
    ],
  },
} satisfies Meta<typeof AuditLogViewer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    entries: [],
  },
}

export const Selectable: Story = {
  args: {
    onEntrySelect: fn(),
  },
}

const SOURCE_LABELS: Record<string, string> = {
  mark8ly: "Mark8ly",
  fe3dr: "Fe3dr",
  console: "Console",
}

export const MergedSources: Story = {
  args: {
    entries: [
      {
        id: "1",
        actor: "operator@tesserix",
        action: "granted access to",
        target: "acme",
        timestamp: "2026-02-24 09:02 UTC",
        source: "console",
      },
      {
        id: "2",
        actor: "jane@acme",
        action: "exported",
        target: "orders.csv",
        timestamp: "2026-02-24 09:03 UTC",
        source: "mark8ly",
      },
      {
        id: "3",
        actor: "System",
        action: "rotated",
        target: "API key",
        timestamp: "2026-02-24 09:07 UTC",
        source: "fe3dr",
      },
    ],
    renderSource: (source) => (
      <span className="rounded border px-1.5 py-0.5">{SOURCE_LABELS[source] ?? source}</span>
    ),
  },
}

export const FormattedMetadata: Story = {
  args: {
    entries: [
      {
        id: "1",
        actor: "Mahesh",
        action: "deleted",
        target: "tenant acme",
        timestamp: "2026-02-24 09:12 UTC",
        metadata: '{"severity":"critical","status":"success","ip":"10.0.0.1"}',
      },
    ],
    renderMetadata: (metadata) => {
      const parsed = JSON.parse(metadata) as { severity?: string; status?: string }
      return (
        <span>
          {parsed.severity} · {parsed.status}
        </span>
      )
    },
  },
}

export const SmokeTest: Story = {
  args: {
    onEntrySelect: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /mahesh updated billing settings/i }))
    await expect(args.onEntrySelect).toHaveBeenCalledWith("1")
    await expect(canvas.getByText(/2 entries/i)).toBeInTheDocument()
  },
}

export const Expandable: Story = {
  args: {
    entries: [
      {
        id: "1",
        actor: "Mahesh",
        action: "updated",
        target: "billing settings",
        timestamp: "2026-02-24 09:12 UTC",
        dateTime: "2026-02-24T09:12:00Z",
        metadata: "Changed payout schedule",
        detail: "before: monthly · after: weekly",
      },
      {
        id: "2",
        actor: "System",
        action: "rotated",
        target: "API key",
        timestamp: "2026-02-24 11:30 UTC",
        dateTime: "2026-02-24T11:30:00Z",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: /show details/i })
    await expect(toggle).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(toggle)
    await expect(canvas.getByText(/before: monthly/)).toBeInTheDocument()

    await userEvent.click(canvas.getByRole("button", { name: /hide details/i }))
    await expect(canvas.queryByText(/before: monthly/)).not.toBeInTheDocument()
  },
}

export const Selected: Story = {
  args: { onEntrySelect: fn(), selectedEntryId: "1" },
}

export const Loading: Story = {
  args: { entries: [], loading: true },
}

export const Severity: Story = {
  args: {
    entries: [
      { id: "1", actor: "System", action: "failed to rotate", target: "API key", timestamp: "09:07 UTC", severity: "critical" },
      { id: "2", actor: "jane@acme", action: "retried", target: "payout", timestamp: "09:09 UTC", severity: "warning" },
      { id: "3", actor: "operator@tesserix", action: "granted access to", target: "acme", timestamp: "09:11 UTC", severity: "info" },
    ],
  },
}

export const Composed: Story = {
  render: () => (
    <AuditLogViewer.Root>
      <AuditLogViewer.Header>
        <AuditLogViewer.Title level={2} />
        <AuditLogViewer.Count>2 entries</AuditLogViewer.Count>
      </AuditLogViewer.Header>
      <AuditLogViewer.List>
        <AuditLogViewer.Row entryId="1" entryLabel="Mahesh updated billing settings" severity="warning">
          <div className="flex items-start gap-2">
            <AuditLogViewer.Summary className="flex-1">
              <p className="text-sm font-medium">Mahesh updated billing settings</p>
              <AuditLogViewer.Time dateTime="2026-02-24T09:12:00Z">09:12 UTC</AuditLogViewer.Time>
            </AuditLogViewer.Summary>
            <AuditLogViewer.Disclosure />
          </div>
          <AuditLogViewer.Detail>before: monthly · after: weekly</AuditLogViewer.Detail>
        </AuditLogViewer.Row>
      </AuditLogViewer.List>
    </AuditLogViewer.Root>
  ),
}
