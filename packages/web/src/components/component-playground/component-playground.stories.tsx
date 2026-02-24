import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { ComponentPlayground } from "./component-playground"

const meta = {
  title: "Developer/ComponentPlayground",
  component: ComponentPlayground,
  tags: ["autodocs"],
  args: {
    initialCode: "<Button variant=\"default\">Run</Button>",
    preview: <button className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground">Run</button>,
  },
} satisfies Meta<typeof ComponentPlayground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
