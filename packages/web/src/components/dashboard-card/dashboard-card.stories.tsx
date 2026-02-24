import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardDescription,
  DashboardCardFooter,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardCardTrend,
  DashboardCardValue,
} from "./dashboard-card"

const meta = {
  title: "DataDisplay/DashboardCard",
  component: DashboardCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Dashboard Patterns</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Dashboard Card Showcase</h2>
          <p className="text-sm text-muted-foreground">Composable cards for metric-heavy product surfaces.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DashboardCard tone="success">
            <DashboardCardHeader>
              <div>
                <DashboardCardTitle>Net Revenue</DashboardCardTitle>
                <DashboardCardDescription>Last 30 days</DashboardCardDescription>
              </div>
              <DashboardCardTrend className="bg-emerald-100 text-emerald-700">+14.2%</DashboardCardTrend>
            </DashboardCardHeader>
            <DashboardCardBody>
              <DashboardCardValue>$182,420</DashboardCardValue>
            </DashboardCardBody>
            <DashboardCardFooter>Updated 2 minutes ago</DashboardCardFooter>
          </DashboardCard>

          <DashboardCard tone="warning">
            <DashboardCardHeader>
              <div>
                <DashboardCardTitle>Open Incidents</DashboardCardTitle>
                <DashboardCardDescription>Service reliability</DashboardCardDescription>
              </div>
              <DashboardCardTrend className="bg-amber-100 text-amber-700">+3</DashboardCardTrend>
            </DashboardCardHeader>
            <DashboardCardBody>
              <DashboardCardValue>12</DashboardCardValue>
            </DashboardCardBody>
            <DashboardCardFooter>Response SLA at 92%</DashboardCardFooter>
          </DashboardCard>

          <DashboardCard tone="critical">
            <DashboardCardHeader>
              <div>
                <DashboardCardTitle>Churn Risk</DashboardCardTitle>
                <DashboardCardDescription>Accounts flagged</DashboardCardDescription>
              </div>
              <DashboardCardTrend className="bg-rose-100 text-rose-700">High</DashboardCardTrend>
            </DashboardCardHeader>
            <DashboardCardBody>
              <DashboardCardValue>28</DashboardCardValue>
            </DashboardCardBody>
            <DashboardCardFooter>Requires CS outreach</DashboardCardFooter>
          </DashboardCard>
        </div>
      </div>
    </div>
  ),
}

export const MetricCard: Story = {
  render: () => (
    <DashboardCard className="w-[360px]">
      <DashboardCardHeader>
        <div>
          <DashboardCardTitle>Activation Rate</DashboardCardTitle>
          <DashboardCardDescription>Users activated in 7 days</DashboardCardDescription>
        </div>
        <DashboardCardTrend>+4.8%</DashboardCardTrend>
      </DashboardCardHeader>
      <DashboardCardBody>
        <DashboardCardValue>67%</DashboardCardValue>
      </DashboardCardBody>
      <DashboardCardFooter>Goal: 70%</DashboardCardFooter>
    </DashboardCard>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/activation rate/i)).toBeInTheDocument()
    await expect(canvas.getByText(/\+4.8%/i)).toBeInTheDocument()
    await expect(canvas.getByText(/67%/i)).toBeInTheDocument()
  },
}

