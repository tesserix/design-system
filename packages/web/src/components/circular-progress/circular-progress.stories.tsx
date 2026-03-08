import type { Meta, StoryObj } from "@storybook/react"

import { CircularProgress } from "./circular-progress"

const meta = {
  title: "Feedback/CircularProgress",
  component: CircularProgress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    max: { control: "number" },
    size: { control: "select", options: ["sm", "md", "lg"] },
    showLabel: { control: "boolean" },
  },
} satisfies Meta<typeof CircularProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { value: 65 },
}

export const Small: Story = {
  args: { value: 40, size: "sm" },
}

export const Large: Story = {
  args: { value: 85, size: "lg" },
}

export const Complete: Story = {
  args: { value: 100 },
}

export const LowProgress: Story = {
  args: { value: 25 },
}

export const WithLabel: Story = {
  args: { value: 75, label: "Complete" },
}

export const NoLabel: Story = {
  args: { value: 50, showLabel: false },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <CircularProgress value={40} size="sm" label="SM" />
      <CircularProgress value={65} size="md" label="MD" />
      <CircularProgress value={85} size="lg" label="LG" />
    </div>
  ),
}
