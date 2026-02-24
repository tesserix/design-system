import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

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

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /mahesh updated billing settings/i }))
    await expect(canvas.getByText(/2 entries/i)).toBeInTheDocument()
  },
}
