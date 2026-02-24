import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Tag } from "./tag"

const meta = {
  title: "Data Display/Tag",
  component: Tag,
  tags: ["autodocs"],
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Design System",
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="primary">Primary</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="destructive">Error</Tag>
      <Tag variant="outline">Outline</Tag>
    </div>
  ),
}

export const Removable: Story = {
  args: {
    children: "React",
    onRemove: () => {},
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
