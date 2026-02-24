import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { SettingsPanel } from "./settings-panel"

const meta = {
  title: "Patterns/SettingsPanel",
  component: SettingsPanel,
  tags: ["autodocs"],
  args: {
    sections: [
      {
        id: "profile",
        title: "Profile",
        description: "Public account settings",
        content: <input className="h-9 w-full rounded border px-2" defaultValue="Mahesh" />,
      },
    ],
  },
} satisfies Meta<typeof SettingsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
