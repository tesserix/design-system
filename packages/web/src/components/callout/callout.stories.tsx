import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Callout, CalloutDescription, CalloutTitle } from "./callout"

const meta = {
  title: "Feedback/Callout",
  component: Callout,
  tags: ["autodocs"],
} satisfies Meta<typeof Callout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Callout>
      <CalloutTitle>Deployment started</CalloutTitle>
      <CalloutDescription>Your release is being processed in the background.</CalloutDescription>
    </Callout>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-3">
      <Callout variant="info"><CalloutTitle>Info</CalloutTitle></Callout>
      <Callout variant="success"><CalloutTitle>Success</CalloutTitle></Callout>
      <Callout variant="warning"><CalloutTitle>Warning</CalloutTitle></Callout>
      <Callout variant="destructive"><CalloutTitle>Error</CalloutTitle></Callout>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
