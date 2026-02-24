import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Stat, StatLabel, StatMeta, StatTrend, StatValue } from "./stat"

const meta = {
  title: "DataDisplay/Stat",
  component: Stat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Data Display</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Stat Showcase</h2>
          <p className="text-sm text-muted-foreground">Compact KPIs for dashboards and analytics surfaces.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat>
            <StatLabel>Monthly Revenue</StatLabel>
            <StatValue>$128,430</StatValue>
            <div className="mt-2 flex items-center gap-2">
              <StatTrend trend="up">+12.4%</StatTrend>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
            <StatMeta>Based on finalized invoices</StatMeta>
          </Stat>

          <Stat>
            <StatLabel>Active Users</StatLabel>
            <StatValue>8,912</StatValue>
            <div className="mt-2 flex items-center gap-2">
              <StatTrend trend="neutral">+0.8%</StatTrend>
              <span className="text-xs text-muted-foreground">week over week</span>
            </div>
            <StatMeta>Unique users in last 30 days</StatMeta>
          </Stat>

          <Stat>
            <StatLabel>Churn Rate</StatLabel>
            <StatValue>2.1%</StatValue>
            <div className="mt-2 flex items-center gap-2">
              <StatTrend trend="down">-0.4%</StatTrend>
              <span className="text-xs text-muted-foreground">improvement</span>
            </div>
            <StatMeta>Subscription cancellations</StatMeta>
          </Stat>
        </div>
      </div>
    </div>
  ),
}

export const TrendStates: Story = {
  render: () => (
    <div className="grid w-[640px] grid-cols-3 gap-4">
      <Stat>
        <StatLabel>Up Trend</StatLabel>
        <StatValue>64%</StatValue>
        <StatTrend trend="up">+6.2%</StatTrend>
      </Stat>
      <Stat>
        <StatLabel>Down Trend</StatLabel>
        <StatValue>18%</StatValue>
        <StatTrend trend="down">-1.9%</StatTrend>
      </Stat>
      <Stat>
        <StatLabel>Neutral Trend</StatLabel>
        <StatValue>42%</StatValue>
        <StatTrend trend="neutral">0.0%</StatTrend>
      </Stat>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/\+6.2%/i)).toBeInTheDocument()
    await expect(canvas.getByText(/-1.9%/i)).toBeInTheDocument()
    await expect(canvas.getByText(/0.0%/i)).toBeInTheDocument()
  },
}

