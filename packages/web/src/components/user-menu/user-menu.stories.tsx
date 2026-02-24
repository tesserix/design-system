import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { UserMenu } from "./user-menu"

const meta = {
  title: "Patterns/UserMenu",
  component: UserMenu,
  tags: ["autodocs"],
  args: {
    name: "Mahesh Sangawar",
    email: "mahesh@tesserix.dev",
    actions: [{ label: "Profile" }, { label: "Settings" }, { label: "Sign out" }],
  },
} satisfies Meta<typeof UserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
