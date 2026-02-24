import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Flex } from "./flex"

const meta = {
  title: "Layout/Flex",
  component: Flex,
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Flex className="w-full max-w-md rounded border p-3" justify="between">
      <span>Left</span>
      <span>Center</span>
      <span>Right</span>
    </Flex>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
