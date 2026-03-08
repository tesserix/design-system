import type { Meta, StoryObj } from "@storybook/react"

import { SidebarSearch, type SidebarSearchItem } from "./sidebar-search"

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
)
const ChartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></svg>
)
const BoxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /></svg>
)
const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
)

const sampleItems: SidebarSearchItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <HomeIcon />, href: "/" },
  { id: "analytics-overview", label: "Overview", icon: <ChartIcon />, href: "/analytics", breadcrumb: ["Analytics"] },
  { id: "analytics-sales", label: "Sales", icon: <ChartIcon />, href: "/analytics/sales", breadcrumb: ["Analytics"] },
  { id: "analytics-customers", label: "Customers", icon: <ChartIcon />, href: "/analytics/customers", breadcrumb: ["Analytics"] },
  { id: "products", label: "Products", icon: <BoxIcon />, href: "/products", breadcrumb: ["Catalog"] },
  { id: "categories", label: "Categories", icon: <BoxIcon />, href: "/categories", breadcrumb: ["Catalog"] },
  { id: "inventory", label: "Inventory", icon: <BoxIcon />, href: "/inventory", breadcrumb: ["Catalog"] },
  { id: "settings-general", label: "Store Settings", icon: <GearIcon />, href: "/settings/general", breadcrumb: ["Settings"], keywords: ["general", "store name"] },
  { id: "settings-shipping", label: "Shipping", icon: <GearIcon />, href: "/settings/shipping", breadcrumb: ["Settings"] },
  { id: "settings-payments", label: "Payments", icon: <GearIcon />, href: "/settings/payments", breadcrumb: ["Settings"] },
]

const meta = {
  title: "Patterns/SidebarSearch",
  component: SidebarSearch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Fuzzy search for sidebar navigation items with keyboard navigation, breadcrumb paths, and match highlighting.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 border rounded-lg bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: sampleItems,
    onSelect: () => {},
  },
}

export const WithMaxResults: Story = {
  args: {
    items: sampleItems,
    maxResults: 3,
    onSelect: () => {},
  },
}
