import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { CommandPalette } from "./command-palette"

const items = [
  { id: "new-project", label: "Create Project", group: "General" },
  { id: "open-settings", label: "Open Settings", group: "General" },
  { id: "invite-user", label: "Invite User", group: "Team" },
]

const meta = {
  title: "Patterns/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: () => {},
    items,
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    items,
  },
  render: (args) => <CommandPalette {...args} />,
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
