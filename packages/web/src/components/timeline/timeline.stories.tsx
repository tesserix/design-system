import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTime,
  TimelineTitle,
} from "./timeline"

const meta = {
  title: "DataDisplay/Timeline",
  component: Timeline,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Data Display</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Timeline Showcase</h2>
          <p className="text-sm text-muted-foreground">Chronological event display for activity and release history.</p>
        </div>

        <Timeline>
          <TimelineItem>
            <TimelineMarker />
            <TimelineConnector />
            <TimelineTime dateTime="2026-02-11">Feb 11, 2026</TimelineTime>
            <TimelineTitle>Roadmap finalized</TimelineTitle>
            <TimelineDescription>
              Product and engineering teams aligned on priorities for Q1 delivery.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem>
            <TimelineMarker />
            <TimelineConnector />
            <TimelineTime dateTime="2026-02-12">Feb 12, 2026</TimelineTime>
            <TimelineTitle>Design system review completed</TimelineTitle>
            <TimelineDescription>
              Accessibility and component quality baselines were updated.
            </TimelineDescription>
          </TimelineItem>

          <TimelineItem>
            <TimelineMarker active />
            <TimelineTime dateTime="2026-02-13">Feb 13, 2026</TimelineTime>
            <TimelineTitle>Release candidate prepared</TimelineTitle>
            <TimelineDescription>
              Final QA and documentation are in progress before rollout.
            </TimelineDescription>
          </TimelineItem>
        </Timeline>
      </div>
    </div>
  ),
}

export const ActiveMilestone: Story = {
  render: () => (
    <Timeline>
      <TimelineItem>
        <TimelineMarker />
        <TimelineConnector />
        <TimelineTime dateTime="2026-02-10">Feb 10, 2026</TimelineTime>
        <TimelineTitle>Discovery</TimelineTitle>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker active />
        <TimelineTime dateTime="2026-02-13">Feb 13, 2026</TimelineTime>
        <TimelineTitle>Implementation</TimelineTitle>
      </TimelineItem>
    </Timeline>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/implementation/i)).toBeInTheDocument()
    const activeMarker = canvas.getAllByRole("listitem")[1]?.querySelector(".border-primary")
    await expect(activeMarker).not.toBeNull()
  },
}

