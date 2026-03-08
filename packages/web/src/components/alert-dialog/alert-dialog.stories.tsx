import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"

import { AlertDialog } from "./alert-dialog"

const meta = {
  title: "Feedback/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    type: { control: "select", options: ["success", "error", "warning", "info", "confirm"] },
    isOpen: { control: "boolean" },
  },
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    isOpen: true,
    title: "Information",
    message: "This is an informational message.",
    type: "info",
    onClose: fn(),
    onConfirm: fn(),
  },
}

export const Success: Story = {
  args: {
    isOpen: true,
    title: "Success!",
    message: "Your changes have been saved successfully.",
    type: "success",
    onClose: fn(),
    onConfirm: fn(),
  },
}

export const Error: Story = {
  args: {
    isOpen: true,
    title: "Error",
    message: "Something went wrong. Please try again.",
    type: "error",
    onClose: fn(),
    onConfirm: fn(),
  },
}

export const Warning: Story = {
  args: {
    isOpen: true,
    title: "Warning",
    message: "This action cannot be undone.",
    type: "warning",
    onClose: fn(),
    onConfirm: fn(),
  },
}

export const Confirm: Story = {
  args: {
    isOpen: true,
    title: "Confirm Delete",
    message: "Are you sure you want to delete this item? This action cannot be undone.",
    type: "confirm",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    onClose: fn(),
    onConfirm: fn(),
    onCancel: fn(),
  },
}
