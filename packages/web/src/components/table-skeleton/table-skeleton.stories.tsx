import type { Meta, StoryObj } from "@storybook/react"

import { CardGridSkeleton, DashboardSkeleton, FormSkeleton, ListSkeleton, TableSkeleton } from "./table-skeleton"

const meta = {
  title: "Feedback/TableSkeleton",
  component: TableSkeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    rows: { control: { type: "range", min: 1, max: 20 } },
    columns: { control: { type: "range", min: 1, max: 8 } },
    hasCheckbox: { control: "boolean" },
    hasActions: { control: "boolean" },
  },
} satisfies Meta<typeof TableSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { rows: 5, columns: 4 },
}

export const WithCheckboxAndActions: Story = {
  args: { rows: 5, columns: 3, hasCheckbox: true, hasActions: true },
}

export const CardGrid: Story = {
  render: () => <CardGridSkeleton count={6} columns={3} />,
}

export const List: Story = {
  render: () => <ListSkeleton count={5} hasAvatar />,
}

export const Dashboard: Story = {
  render: () => <DashboardSkeleton />,
}

export const Form: Story = {
  render: () => <FormSkeleton fields={5} />,
}
