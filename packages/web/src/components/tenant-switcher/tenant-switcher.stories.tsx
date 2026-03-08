import type { Meta, StoryObj } from "@storybook/react"

import { TenantSwitcher, type TenantItem } from "./tenant-switcher"

const sampleItems: TenantItem[] = [
  { id: "1", name: "Acme Corp", subtitle: "acme-corp", color: "#6366f1", role: "owner", isDefault: true, group: "Your Workspaces" },
  { id: "2", name: "Widget Co", subtitle: "widget-co", color: "#ec4899", role: "admin", group: "Your Workspaces" },
  { id: "3", name: "Demo Store", subtitle: "demo-store", color: "#14b8a6", role: "member", group: "Member Of" },
  { id: "4", name: "Enterprise Inc", subtitle: "enterprise", color: "#f59e0b", role: "viewer", group: "Member Of" },
  { id: "5", name: "Test Workspace", subtitle: "test-ws", color: "#8b5cf6", group: "Member Of" },
]

const meta = {
  title: "Patterns/TenantSwitcher",
  component: TenantSwitcher,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A generic workspace/org/tenant switcher dropdown with search, grouping, and default selection.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TenantSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: sampleItems,
    selectedId: "1",
    onSelect: () => {},
    onCreateNew: () => {},
    createNewLabel: "Create New Business",
  },
}

export const Compact: Story = {
  args: {
    items: sampleItems,
    selectedId: "1",
    variant: "compact",
    onSelect: () => {},
  },
}

export const Grouped: Story = {
  args: {
    items: sampleItems,
    selectedId: "1",
    grouped: true,
    onSelect: () => {},
    onSetDefault: () => {},
    onCreateNew: () => {},
  },
}

export const NoSelection: Story = {
  args: {
    items: sampleItems,
    onSelect: () => {},
  },
}

export const Loading: Story = {
  args: {
    items: [],
    isLoading: true,
  },
}

export const FewItems: Story = {
  args: {
    items: sampleItems.slice(0, 2),
    selectedId: "1",
    onSelect: () => {},
  },
}
