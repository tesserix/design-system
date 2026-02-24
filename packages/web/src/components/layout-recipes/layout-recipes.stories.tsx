import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { AppShell, AppShellContent, AppShellHeader, AppShellMain, AppShellSidebar } from "../app-shell"
import { Badge } from "../badge"
import { BentoGrid, BentoGridItem, BentoGridItemMeta, BentoGridItemTitle, BentoGridItemValue } from "../bento-grid"
import { Button } from "../button"
import { Card, CardContent, CardHeader, CardTitle } from "../card"
import { HeroActions, HeroDescription, HeroEyebrow, HeroSection, HeroTitle } from "../hero-section"
import { PageHeader, PageHeaderContent, PageHeaderDescription, PageHeaderHeading, PageHeaderTitle } from "../page-header"
import { Container, Section } from "../section"
import { SidebarNav, SidebarNavItem, SidebarNavLabel, SidebarNavList, SidebarNavSection } from "../sidebar-nav"

const meta = {
  title: "Recipes/LayoutRecipes",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AppRecipe: Story = {
  render: () => (
    <AppShell>
      <AppShellSidebar>
        <SidebarNav>
          <SidebarNavSection>
            <SidebarNavLabel>App</SidebarNavLabel>
            <SidebarNavList>
              <li>
                <SidebarNavItem href="#" active>
                  Overview
                </SidebarNavItem>
              </li>
              <li>
                <SidebarNavItem href="#">Workflows</SidebarNavItem>
              </li>
            </SidebarNavList>
          </SidebarNavSection>
        </SidebarNav>
      </AppShellSidebar>
      <AppShellMain>
        <AppShellHeader>
          <div className="flex items-center justify-between">
            <p className="text-sm">Workspace</p>
            <Button size="sm">New</Button>
          </div>
        </AppShellHeader>
        <AppShellContent>
          <PageHeader>
            <PageHeaderContent>
              <PageHeaderHeading>
                <PageHeaderTitle>App Layout Recipe</PageHeaderTitle>
                <PageHeaderDescription>Baseline structure for authenticated product surfaces.</PageHeaderDescription>
              </PageHeaderHeading>
            </PageHeaderContent>
          </PageHeader>
        </AppShellContent>
      </AppShellMain>
    </AppShell>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /app layout recipe/i })).toBeInTheDocument()
    await expect(canvas.getByRole("navigation")).toBeInTheDocument()
  },
}

export const DashboardRecipe: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderHeading>
              <PageHeaderTitle>Dashboard Layout Recipe</PageHeaderTitle>
              <PageHeaderDescription>Use BentoGrid for metric density and quick scanability.</PageHeaderDescription>
            </PageHeaderHeading>
            <Badge variant="success">Stable</Badge>
          </PageHeaderContent>
        </PageHeader>
        <BentoGrid>
          <BentoGridItem size="md">
            <BentoGridItemTitle>MRR</BentoGridItemTitle>
            <BentoGridItemValue>$182,420</BentoGridItemValue>
            <BentoGridItemMeta>+12.4% MoM</BentoGridItemMeta>
          </BentoGridItem>
          <BentoGridItem>
            <BentoGridItemTitle>Incidents</BentoGridItemTitle>
            <BentoGridItemValue>3</BentoGridItemValue>
            <BentoGridItemMeta>Under SLA</BentoGridItemMeta>
          </BentoGridItem>
        </BentoGrid>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /dashboard layout recipe/i })).toBeInTheDocument()
    await expect(canvas.getByText(/\$182,420/i)).toBeInTheDocument()
  },
}

export const MarketingRecipe: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <Section>
        <Container>
          <HeroSection>
            <HeroEyebrow>Marketing Layout Recipe</HeroEyebrow>
            <HeroTitle>Tell a clear product story with reusable sections.</HeroTitle>
            <HeroDescription>Compose hero, feature cards, and CTA modules with shared primitives.</HeroDescription>
            <HeroActions>
              <Button>Start Free Trial</Button>
              <Button variant="outline">Contact Sales</Button>
            </HeroActions>
          </HeroSection>
        </Container>
      </Section>
      <Section className="pt-0">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Faster onboarding</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Unified UI patterns reduce implementation churn.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stronger consistency</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Design tokens keep brand expression aligned across products.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Confident releases</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Storybook tests catch regressions before deployment.</CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/marketing layout recipe/i)).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /start free trial/i })).toBeInTheDocument()
  },
}

export const AdminListDetailRecipe: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Acme Inc.", "Northwind", "Globex", "Initech"].map((customer) => (
              <button key={customer} className="w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-accent">
                {customer}
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Selected customer details, activity stream, and quick actions.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline">Suspend</Button>
              <Button>Update plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /customer detail/i })).toBeInTheDocument()
  },
}

export const AdminSettingsShellRecipe: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[240px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["General", "Security", "Billing", "Integrations"].map((item) => (
              <button key={item} className="w-full rounded-md border px-3 py-2 text-left text-sm hover:bg-accent">
                {item}
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <SkeletonRow />
            <SkeletonRow />
            <div className="pt-2">
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /save changes/i })).toBeInTheDocument()
  },
}

const SkeletonRow = () => (
  <div className="rounded-md border p-3">
    <p className="text-foreground">Field label</p>
    <p className="text-xs">Field value placeholder</p>
  </div>
)

export const AdminDashboardShellRecipe: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderHeading>
              <PageHeaderTitle>Admin Dashboard Shell</PageHeaderTitle>
              <PageHeaderDescription>Responsive shell for analytics-heavy operations teams.</PageHeaderDescription>
            </PageHeaderHeading>
            <Badge variant="secondary">Live</Badge>
          </PageHeaderContent>
        </PageHeader>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Revenue", "Orders", "Latency", "Errors"].map((kpi) => (
            <Card key={kpi}>
              <CardHeader>
                <CardTitle className="text-sm">{kpi}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">--</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/admin dashboard shell/i)).toBeInTheDocument()
  },
}
