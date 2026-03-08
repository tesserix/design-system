import type { Meta, StoryObj } from "@storybook/react"

import { ResponsiveTable } from "./responsive-table"

type SampleData = { id: string; name: string; email: string; status: string; role: string }

const sampleData: SampleData[] = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "Active", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "Inactive", role: "User" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "Active", role: "Manager" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", status: "Pending", role: "User" },
]

const columns = [
  { key: "name" as const, header: "Name", isPrimary: true },
  { key: "email" as const, header: "Email", isSecondary: true },
  { key: "status" as const, header: "Status" },
  { key: "role" as const, header: "Role" },
]

const meta = {
  title: "Data Display/ResponsiveTable",
  component: ResponsiveTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ResponsiveTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
    keyExtractor: (item: SampleData) => item.id,
  } as any,
}

export const Empty: Story = {
  args: {
    data: [],
    columns,
    keyExtractor: (item: SampleData) => item.id,
    emptyMessage: "No users found",
  } as any,
}

export const Loading: Story = {
  args: {
    data: [],
    columns,
    keyExtractor: (item: SampleData) => item.id,
    isLoading: true,
  } as any,
}
