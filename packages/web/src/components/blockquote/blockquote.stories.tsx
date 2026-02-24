import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Blockquote } from "./blockquote"

const meta = {
  title: "Feedback/Blockquote",
  component: Blockquote,
  tags: ["autodocs"],
} satisfies Meta<typeof Blockquote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Blockquote>
      Design systems are less about components and more about consistency at scale.
      <cite>Jane Doe</cite>
    </Blockquote>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
