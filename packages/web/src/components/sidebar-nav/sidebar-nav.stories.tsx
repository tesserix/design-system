import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Badge } from "../badge"
import { SidebarNav, SidebarNavItem, SidebarNavLabel, SidebarNavList, SidebarNavSection } from "./sidebar-nav"

const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" />
  </svg>
)
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <path d="M20 8v6M23 11h-6" />
  </svg>
)
const IconBolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
)

const meta = {
  title: "Navigation/SidebarNav",
  component: SidebarNav,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[280px] rounded-2xl border bg-card p-3">
      <SidebarNav>
        <SidebarNavSection>
          <SidebarNavLabel>Workspace</SidebarNavLabel>
          <SidebarNavList>
            <li>
              <SidebarNavItem href="#" active icon={<IconGrid />}>
                Overview
              </SidebarNavItem>
            </li>
            <li>
              <SidebarNavItem href="#" icon={<IconUsers />} badge={<Badge variant="secondary">12</Badge>}>
                Team
              </SidebarNavItem>
            </li>
            <li>
              <SidebarNavItem href="#" icon={<IconBolt />}>
                Automations
              </SidebarNavItem>
            </li>
          </SidebarNavList>
        </SidebarNavSection>
      </SidebarNav>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /overview/i })).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /team/i })).toBeInTheDocument()
  },
}

export const Compact: Story = {
  render: () => (
    <div className="w-[88px] rounded-2xl border bg-card p-3">
      <SidebarNav>
        <SidebarNavSection>
          <SidebarNavLabel>Compact</SidebarNavLabel>
          <SidebarNavList>
            <li>
              <SidebarNavItem href="#" active compact icon={<IconGrid />}>
                Overview
              </SidebarNavItem>
            </li>
            <li>
              <SidebarNavItem href="#" compact icon={<IconUsers />}>
                Team
              </SidebarNavItem>
            </li>
          </SidebarNavList>
        </SidebarNavSection>
      </SidebarNav>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /overview/i })).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /team/i })).toBeInTheDocument()
  },
}

export const WithSubItems: Story = {
  render: () => (
    <div className="w-[300px] rounded-2xl border bg-card p-3">
      <SidebarNav>
        <SidebarNavSection>
          <SidebarNavLabel>Projects</SidebarNavLabel>
          <SidebarNavList>
            <li>
              <SidebarNavItem href="#" active icon={<IconGrid />}>
                Platform
              </SidebarNavItem>
              <ul className="mt-1 space-y-1 pl-8">
                <li>
                  <SidebarNavItem href="#" className="py-1.5 text-xs">
                    Overview
                  </SidebarNavItem>
                </li>
                <li>
                  <SidebarNavItem href="#" className="py-1.5 text-xs" active>
                    Releases
                  </SidebarNavItem>
                </li>
                <li>
                  <SidebarNavItem href="#" className="py-1.5 text-xs">
                    Environments
                  </SidebarNavItem>
                </li>
              </ul>
            </li>
            <li>
              <SidebarNavItem href="#" icon={<IconUsers />}>
                Team
              </SidebarNavItem>
            </li>
          </SidebarNavList>
        </SidebarNavSection>
      </SidebarNav>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /^platform$/i })).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /^releases$/i })).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /^environments$/i })).toBeInTheDocument()
  },
}
