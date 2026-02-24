import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Tour } from "./tour"

const steps = [
  { id: "1", title: "Welcome", description: "Start from the dashboard overview." },
  { id: "2", title: "Create", description: "Use the create button for new resources." },
]

const meta = {
  title: "Patterns/Tour",
  component: Tour,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: () => {},
    steps,
  },
} satisfies Meta<typeof Tour>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    steps,
  },
  render: () => {
    const [open, setOpen] = React.useState(true)
    return <Tour open={open} onOpenChange={setOpen} steps={steps} />
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await expect(canvas.getByText("Create")).toBeTruthy()
  },
}

export const NavigationFlow: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return <Tour open={open} onOpenChange={setOpen} steps={[...steps, { id: "3", title: "Finish", description: "Complete setup." }]} />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await userEvent.click(canvas.getByRole("button", { name: "Back" }))
    await waitFor(() => {
      expect(canvas.getByText("Welcome")).toBeInTheDocument()
    })
  },
}

export const WithTargetScroll: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true)
    return (
      <div className="space-y-96">
        <div id="intro-anchor" className="rounded border p-4">Intro target</div>
        <Tour
          open={open}
          onOpenChange={setOpen}
          steps={[{ id: "1", title: "Jump", description: "Scroll to target", targetSelector: "#intro-anchor" }]}
        />
      </div>
    )
  },
}
