import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Step, Steps } from "./steps"

const meta = {
  title: "Navigation/Steps",
  component: Steps,
  tags: ["autodocs"],
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
} satisfies Meta<typeof Steps>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
  render: () => (
    <Steps currentStep={2} totalSteps={4}>
      <Step step={1} title="Account" />
      <Step step={2} title="Team" />
      <Step step={3} title="Billing" />
      <Step step={4} title="Review" />
    </Steps>
  ),
}

export const SmokeTest: Story = {
  render: Horizontal.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
