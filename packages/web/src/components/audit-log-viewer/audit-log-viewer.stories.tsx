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
