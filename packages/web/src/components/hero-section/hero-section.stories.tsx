import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Badge } from "../badge"
import { Button } from "../button"
import { HeroActions, HeroDescription, HeroEyebrow, HeroSection, HeroTitle, HeroVisual } from "./hero-section"

const meta = {
  title: "Layout/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroSection>

export default meta
type Story = StoryObj<typeof meta>

export const LandingHero: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <HeroSection>
          <HeroEyebrow>Design System Platform</HeroEyebrow>
          <HeroTitle>Ship cohesive product surfaces with enterprise-grade UI primitives.</HeroTitle>
          <HeroDescription>
            Build faster with accessible components, layout systems, and robust theming for every Tesserix product.
          </HeroDescription>
          <HeroActions>
            <Button>Get Started</Button>
            <Button variant="outline">View Storybook</Button>
            <Badge variant="secondary">v0.1.3</Badge>
          </HeroActions>
          <HeroVisual>
            <p className="text-sm text-muted-foreground">Adoption +23% after standardizing dashboard modules.</p>
          </HeroVisual>
        </HeroSection>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /ship cohesive product surfaces/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /get started/i })).toBeInTheDocument()
  },
}

export const CompactHero: Story = {
  render: () => (
    <div className="mx-auto w-full max-w-4xl p-6">
      <HeroSection className="gap-4 p-6">
        <HeroEyebrow>Release Notes</HeroEyebrow>
        <HeroTitle>New analytics modules are now available.</HeroTitle>
        <HeroDescription>Enable faster reporting with prebuilt charts and operational metrics.</HeroDescription>
        <HeroActions>
          <Button size="sm">Read update</Button>
        </HeroActions>
      </HeroSection>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: /new analytics modules are now available/i })).toBeInTheDocument()
    await expect(canvas.getByRole("button", { name: /read update/i })).toBeInTheDocument()
  },
}
