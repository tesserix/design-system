import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { MultiSelect } from "./multi-select"

const options = [
  { value: "design", label: "Design" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "devops", label: "DevOps" },
]

const meta = {
  title: "Input/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  args: {
    options,
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FixedWidth: Story = {
  render: (args) => (
    <div className="w-[420px]">
      <MultiSelect {...args} />
    </div>
  ),
}

export const WithDefaults: Story = {
  args: {
    defaultValue: ["design", "frontend"],
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
