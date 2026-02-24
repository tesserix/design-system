import type { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "storybook/test"

import { DiffViewer } from "./diff-viewer"

const before = `name: Alpha\nstatus: draft\nowner: alice`
const after = `name: Alpha\nstatus: published\nowner: alice\npriority: high`

const meta = {
  title: "Data Display/DiffViewer",
  component: DiffViewer,
  tags: ["autodocs"],
  args: {
    oldValue: before,
    newValue: after,
  },
} satisfies Meta<typeof DiffViewer>

export default meta
type Story = StoryObj<typeof meta>

export const Split: Story = {}

export const Unified: Story = {
  args: {
    view: "unified",
  },
}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText((content) => content.includes("status: published"))).toBeInTheDocument()
  },
}
