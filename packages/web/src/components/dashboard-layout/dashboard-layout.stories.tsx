import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Badge } from "../badge"
import { BentoGrid, BentoGridItem, BentoGridItemMeta, BentoGridItemTitle, BentoGridItemValue } from "../bento-grid"
import { Card, CardContent, CardHeader, CardTitle } from "../card"
import {
  DashboardLayout,
  DashboardLayoutBody,
  DashboardLayoutHeader,
  DashboardLayoutMain,
  DashboardLayoutRail,
} from "./dashboard-layout"

const meta = {
  title: "Layout/DashboardLayout",
  component: DashboardLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardLayout>

export default meta
type Story = StoryObj<typeof meta>

export const AnalyticsWorkspace: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardLayoutHeader>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Analytics Workspace</p>
            <p className="text-xs text-muted-foreground">Daily performance snapshot</p>
          </div>
          <Badge variant="success">Healthy</Badge>
        </div>
      </DashboardLayoutHeader>

      <DashboardLayoutBody>
        <DashboardLayoutMain>
          <BentoGrid>
            <BentoGridItem size="md">
              <BentoGridItemTitle>MRR</BentoGridItemTitle>
              <BentoGridItemValue>$182,420</BentoGridItemValue>
              <BentoGridItemMeta>+12.4% MoM</BentoGridItemMeta>
            </BentoGridItem>
            <BentoGridItem size="sm">
              <BentoGridItemTitle>Active Deals</BentoGridItemTitle>
              <BentoGridItemValue>42</BentoGridItemValue>
              <BentoGridItemMeta>Pipeline coverage 3.2x</BentoGridItemMeta>
            </BentoGridItem>
            <BentoGridItem size="sm">
              <BentoGridItemTitle>Incidents</BentoGridItemTitle>
              <BentoGridItemValue>3</BentoGridItemValue>
              <BentoGridItemMeta>Within SLA</BentoGridItemMeta>
            </BentoGridItem>
          </BentoGrid>
        </DashboardLayoutMain>

        <DashboardLayoutRail>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Standup 10:00 AM</p>
              <p>Launch review 2:30 PM</p>
              <p>Weekly report 5:00 PM</p>
            </CardContent>
          </Card>
        </DashboardLayoutRail>
      </DashboardLayoutBody>
    </DashboardLayout>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("banner")).toBeInTheDocument()
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(canvas.getByRole("complementary")).toBeInTheDocument()
    await expect(canvas.getByText(/analytics workspace/i)).toBeInTheDocument()
    await expect(canvas.getByText(/\$182,420/i)).toBeInTheDocument()
  },
}

export const MainOnly: Story = {
  render: () => (
    <DashboardLayout>
      <DashboardLayoutHeader>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <p className="text-sm font-semibold">Main Only</p>
          <Badge variant="outline">Preview</Badge>
        </div>
      </DashboardLayoutHeader>
      <DashboardLayoutBody className="lg:grid-cols-1">
        <DashboardLayoutMain>
          <Card>
            <CardHeader>
              <CardTitle>Single Column Flow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Optimized layout when no right rail widgets are required.
            </CardContent>
          </Card>
        </DashboardLayoutMain>
      </DashboardLayoutBody>
    </DashboardLayout>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("banner")).toBeInTheDocument()
    await expect(canvas.getByRole("main")).toBeInTheDocument()
    await expect(canvas.getByText(/single column flow/i)).toBeInTheDocument()
  },
}
