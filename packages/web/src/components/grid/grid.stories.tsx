import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Grid } from "./grid"

const meta = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Grid cols={3} className="w-full max-w-lg">
      <div className="rounded border p-3">1</div>
      <div className="rounded border p-3">2</div>
      <div className="rounded border p-3">3</div>
    </Grid>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
