import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { FeatureCard, FeatureDescription, FeatureGrid, FeatureIcon, FeatureTitle } from "./feature-grid"

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5z" />
  </svg>
)

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
)

const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 3v18h18" />
    <path d="m7 14 4-4 3 3 5-6" />
  </svg>
)

const meta = {
  title: "Layout/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FeatureGrid>

export default meta
type Story = StoryObj<typeof meta>

export const MarketingFeatures: Story = {
  render: () => (
    <div className="w-full max-w-5xl">
      <FeatureGrid>
        <FeatureCard emphasis="highlighted">
          <FeatureIcon>
            <IconShield />
          </FeatureIcon>
          <FeatureTitle>Enterprise Security</FeatureTitle>
          <FeatureDescription>Secure component patterns and testing workflows for regulated teams.</FeatureDescription>
        </FeatureCard>
        <FeatureCard>
          <FeatureIcon>
            <IconZap />
          </FeatureIcon>
          <FeatureTitle>Fast Delivery</FeatureTitle>
          <FeatureDescription>Composable primitives to build product pages faster with fewer regressions.</FeatureDescription>
        </FeatureCard>
        <FeatureCard emphasis="muted">
          <FeatureIcon>
            <IconChart />
          </FeatureIcon>
          <FeatureTitle>Consistent Analytics UI</FeatureTitle>
          <FeatureDescription>Dashboard and data surfaces aligned through shared design tokens.</FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/enterprise security/i)).toBeInTheDocument()
    await expect(canvas.getByText(/fast delivery/i)).toBeInTheDocument()
  },
}

export const TwoColumnFeatures: Story = {
  render: () => (
    <div className="w-full max-w-4xl">
      <FeatureGrid className="md:grid-cols-2">
        <FeatureCard>
          <FeatureIcon>
            <IconShield />
          </FeatureIcon>
          <FeatureTitle>Compliance Ready</FeatureTitle>
          <FeatureDescription>Ship audited UI patterns for enterprise-grade controls.</FeatureDescription>
        </FeatureCard>
        <FeatureCard emphasis="highlighted">
          <FeatureIcon>
            <IconZap />
          </FeatureIcon>
          <FeatureTitle>Faster Adoption</FeatureTitle>
          <FeatureDescription>Teams align quickly through shared UI contracts.</FeatureDescription>
        </FeatureCard>
      </FeatureGrid>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/compliance ready/i)).toBeInTheDocument()
    await expect(canvas.getByText(/faster adoption/i)).toBeInTheDocument()
  },
}
