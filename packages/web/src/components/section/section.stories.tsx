import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Card, CardContent, CardHeader, CardTitle } from "../card"
import { Container, Section, SectionDescription, SectionHeader, SectionTitle } from "./section"

const meta = {
  title: "Layout/Section",
  component: Section,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const MarketingSection: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <Section>
        <Container>
          <SectionHeader>
            <div className="space-y-1">
              <SectionTitle>Why teams choose Tesserix UI</SectionTitle>
              <SectionDescription>
                Opinionated components and layout primitives that keep product quality consistent across teams.
              </SectionDescription>
            </div>
          </SectionHeader>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Faster Delivery</CardTitle>
              </CardHeader>
              <CardContent>Ship product pages and dashboards from reusable patterns.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strong A11y</CardTitle>
              </CardHeader>
              <CardContent>Baseline accessibility checks are integrated into Storybook testing.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme Control</CardTitle>
              </CardHeader>
              <CardContent>Token-driven themes ensure visual consistency in light and dark mode.</CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /why teams choose tesserix ui/i })).toBeInTheDocument()
    await expect(canvas.getByText(/faster delivery/i)).toBeInTheDocument()
  },
}

export const CompactSection: Story = {
  render: () => (
    <Section className="py-10">
      <Container>
        <SectionHeader className="mb-4">
          <div className="space-y-1">
            <SectionTitle>Compact Section</SectionTitle>
            <SectionDescription>Used for shorter content blocks in dense pages.</SectionDescription>
          </div>
        </SectionHeader>
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            This section uses tighter spacing for dashboard contexts.
          </CardContent>
        </Card>
      </Container>
    </Section>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /compact section/i })).toBeInTheDocument()
    await expect(canvas.getByText(/tighter spacing/i)).toBeInTheDocument()
  },
}
