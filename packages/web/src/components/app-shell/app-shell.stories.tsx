import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Badge } from "../badge"
import { Button } from "../button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from "../page-header"
import { SidebarNav, SidebarNavItem, SidebarNavLabel, SidebarNavList, SidebarNavSection } from "../sidebar-nav"
import { AppShell, AppShellContent, AppShellFooter, AppShellHeader, AppShellMain, AppShellSidebar } from "./app-shell"

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 10.5 12 3l9 7.5V21H3z" />
  </svg>
)
const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 3v18h18" />
    <path d="m7 14 4-4 3 3 5-6" />
  </svg>
)
const IconBox = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
  </svg>
)

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AppShell>
      <AppShellSidebar>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold">Tesserix</p>
          <Badge variant="outline">Pro</Badge>
        </div>
        <SidebarNav>
          <SidebarNavSection>
            <SidebarNavLabel>General</SidebarNavLabel>
            <SidebarNavList>
              <li>
                <SidebarNavItem href="#" icon={<IconHome />} active>
                  Overview
                </SidebarNavItem>
              </li>
              <li>
                <SidebarNavItem href="#" icon={<IconChart />}>
                  Analytics
                </SidebarNavItem>
              </li>
              <li>
                <SidebarNavItem href="#" icon={<IconBox />}>
                  Inventory
                </SidebarNavItem>
              </li>
            </SidebarNavList>
          </SidebarNavSection>
        </SidebarNav>
      </AppShellSidebar>

      <AppShellMain>
        <AppShellHeader>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Friday Planning</p>
            <Button size="sm">New Report</Button>
          </div>
        </AppShellHeader>

        <AppShellContent className="space-y-4">
          <PageHeader>
            <PageHeaderContent>
              <PageHeaderHeading>
                <PageHeaderTitle>Operations Overview</PageHeaderTitle>
                <PageHeaderDescription>
                  A unified surface for weekly metrics, active risks, and launch coordination.
                </PageHeaderDescription>
              </PageHeaderHeading>
              <PageHeaderActions>
                <Button variant="outline">Export</Button>
                <Button>Publish</Button>
              </PageHeaderActions>
            </PageHeaderContent>
          </PageHeader>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardDescription>MRR</CardDescription>
                <CardTitle>$182,420</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">+12.4% vs last month</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Active Accounts</CardDescription>
                <CardTitle>2,904</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">+214 this week</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Incidents</CardDescription>
                <CardTitle>3</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">All within SLA</CardContent>
            </Card>
          </div>
        </AppShellContent>

        <AppShellFooter>Last synced 2 minutes ago</AppShellFooter>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
    await expect(canvas.getByRole("banner")).toBeInTheDocument()
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(canvas.getByRole("contentinfo")).toBeInTheDocument()
    await expect(canvas.getByRole("heading", { name: /operations overview/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /publish/i })).toBeInTheDocument()
  },
}

export const MinimalShell: Story = {
  render: () => (
    <AppShell className="lg:grid-cols-[220px_1fr]">
      <AppShellSidebar>
        <SidebarNav>
          <SidebarNavSection>
            <SidebarNavLabel>Primary</SidebarNavLabel>
            <SidebarNavList>
              <li>
                <SidebarNavItem href="#" active icon={<IconHome />}>
                  Home
                </SidebarNavItem>
              </li>
            </SidebarNavList>
          </SidebarNavSection>
        </SidebarNav>
      </AppShellSidebar>
      <AppShellMain>
        <AppShellHeader>
          <p className="text-sm font-medium">Minimal Shell</p>
        </AppShellHeader>
        <AppShellContent>
          <Card>
            <CardHeader>
              <CardTitle>Primary Workspace</CardTitle>
              <CardDescription>Reduced chrome for focused tasks.</CardDescription>
            </CardHeader>
            <CardContent>Core content area</CardContent>
          </Card>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(canvas.getByText(/primary workspace/i)).toBeInTheDocument()
  },
}

export const SidebarWithSubItems: Story = {
  render: () => (
    <AppShell>
      <AppShellSidebar>
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold">Tesserix</p>
          <Badge variant="outline">Team</Badge>
        </div>
        <SidebarNav>
          <SidebarNavSection>
            <SidebarNavLabel>Workspace</SidebarNavLabel>
            <SidebarNavList>
              <li>
                <SidebarNavItem href="#" icon={<IconHome />} active>
                  Projects
                </SidebarNavItem>
                <ul className="mt-1 space-y-1 pl-8">
                  <li>
                    <SidebarNavItem href="#" className="py-1.5 text-xs">
                      Active
                    </SidebarNavItem>
                  </li>
                  <li>
                    <SidebarNavItem href="#" className="py-1.5 text-xs" active>
                      Backlog
                    </SidebarNavItem>
                  </li>
                  <li>
                    <SidebarNavItem href="#" className="py-1.5 text-xs">
                      Archived
                    </SidebarNavItem>
                  </li>
                </ul>
              </li>
              <li>
                <SidebarNavItem href="#" icon={<IconChart />}>
                  Analytics
                </SidebarNavItem>
              </li>
            </SidebarNavList>
          </SidebarNavSection>
        </SidebarNav>
      </AppShellSidebar>

      <AppShellMain>
        <AppShellHeader>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Project Workspace</p>
            <Button size="sm">Create Project</Button>
          </div>
        </AppShellHeader>
        <AppShellContent className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backlog Board</CardTitle>
              <CardDescription>Nested sidebar links keep parent and child navigation grouped.</CardDescription>
            </CardHeader>
            <CardContent>Choose a sub-item on the left to filter project lists.</CardContent>
          </Card>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /^projects$/i })).toBeInTheDocument()
    await expect(canvas.getByRole("link", { name: /^backlog$/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /create project/i })).toBeInTheDocument()
  },
}
