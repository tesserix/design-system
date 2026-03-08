import type { Meta, StoryObj } from "@storybook/react"

import { StatusBadge, getStatusFromMapping } from "./status-badge"

const meta = {
  title: "Data Display/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    status: { control: "select", options: ["success", "warning", "error", "info", "neutral"] },
    size: { control: "select", options: ["sm", "default", "lg"] },
    showIcon: { control: "boolean" },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "Active", status: "success" },
}

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusBadge status="success">Active</StatusBadge>
      <StatusBadge status="warning">Pending</StatusBadge>
      <StatusBadge status="error">Failed</StatusBadge>
      <StatusBadge status="info">Processing</StatusBadge>
      <StatusBadge status="neutral">Inactive</StatusBadge>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <StatusBadge status="success" size="sm">Small</StatusBadge>
      <StatusBadge status="success" size="default">Default</StatusBadge>
      <StatusBadge status="success" size="lg">Large</StatusBadge>
    </div>
  ),
}

export const OrderStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
        <StatusBadge key={s} status={getStatusFromMapping("order", s)}>{s}</StatusBadge>
      ))}
    </div>
  ),
}

export const PaymentStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["PENDING", "PAID", "PARTIALLY_PAID", "REFUNDED", "FAILED"].map(s => (
        <StatusBadge key={s} status={getStatusFromMapping("payment", s)}>{s}</StatusBadge>
      ))}
    </div>
  ),
}
