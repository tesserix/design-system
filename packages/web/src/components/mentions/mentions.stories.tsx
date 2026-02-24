import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { Mentions } from "./mentions"

const meta = {
  title: "Input/Mentions",
  component: Mentions,
  tags: ["autodocs"],
  args: {
    options: [
      { id: "1", label: "mahesh" },
      { id: "2", label: "alex" },
      { id: "3", label: "sara" },
    ],
  },
} satisfies Meta<typeof Mentions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByRole("textbox"), "@ma")
    await expect(canvas.getByRole("button", { name: "mahesh" })).toBeTruthy()
  },
}
