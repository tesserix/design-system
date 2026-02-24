import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { PermissionsMatrix } from "./permissions-matrix"

const meta = {
  title: "Patterns/PermissionsMatrix",
  component: PermissionsMatrix,
  tags: ["autodocs"],
  args: {
    roles: ["Admin", "Editor", "Viewer"],
    permissions: [
      { id: "users.read", label: "Read users", category: "Users" },
      { id: "users.write", label: "Write users", category: "Users" },
      { id: "billing.manage", label: "Manage billing", category: "Billing" },
    ],
    value: {
      Admin: ["users.read", "users.write", "billing.manage"],
      Editor: ["users.read"],
      Viewer: ["users.read"],
    },
  },
} satisfies Meta<typeof PermissionsMatrix>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByLabelText("Editor Write users"))
    await expect(canvas.getByLabelText("Editor Write users")).toBeChecked()
  },
}
