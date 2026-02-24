import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Divider } from "./divider"

const meta = {
  title: "Data Display/Divider",
  component: Divider,
  tags: ["autodocs"],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <p className="text-sm">Top content</p>
      <Divider />
      <p className="text-sm">Bottom content</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-3">
      <span>Left</span>
      <Divider orientation="vertical" className="h-8" />
      <span>Right</span>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Horizontal.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
