import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { BarChart, LineChart } from "./charts"

const data = [
  { label: "Jan", value: 42 },
  { label: "Feb", value: 58 },
  { label: "Mar", value: 33 },
  { label: "Apr", value: 71 },
]

const meta = {
  title: "Data Visualization/Charts",
  component: BarChart,
  tags: ["autodocs"],
  args: { data },
} satisfies Meta<typeof BarChart>

export default meta
type Story = StoryObj<typeof meta>

export const Bars: Story = {}

export const Line: Story = {
  render: () => <LineChart data={data} />,
}

export const SmokeTest: Story = {
  render: Bars.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
