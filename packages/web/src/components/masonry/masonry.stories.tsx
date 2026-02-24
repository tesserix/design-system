import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Masonry } from "./masonry"

const cards = Array.from({ length: 9 }, (_, i) => (
  <div
    key={i}
    className="rounded-xl border bg-card p-4 text-sm"
    style={{ minHeight: `${80 + (i % 4) * 40}px` }}
  >
    Card {i + 1}
  </div>
))

const meta = {
  title: "Layouts/Masonry",
  component: Masonry,
  tags: ["autodocs"],
  args: {
    items: cards,
    columns: 3,
  },
} satisfies Meta<typeof Masonry>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoColumns: Story = {
  args: {
    columns: 2,
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
