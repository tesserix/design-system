import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { Transfer } from "./transfer"

const meta = {
  title: "Data Display/Transfer",
  component: Transfer,
  tags: ["autodocs"],
  args: {
    sourceItems: [
      { id: "1", label: "Apple" },
      { id: "2", label: "Banana" },
    ],
  },
} satisfies Meta<typeof Transfer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInitialTarget: Story = {
  args: {
    sourceItems: [
      { id: "1", label: "Apple" },
      { id: "2", label: "Banana" },
      { id: "3", label: "Orange" },
    ],
    targetItems: [{ id: "9", label: "Grape" }],
  },
}

export const Controlled: Story = {
  render: () => {
    const [state, setState] = React.useState({
      sourceItems: [
        { id: "1", label: "Apple" },
        { id: "2", label: "Banana" },
        { id: "3", label: "Orange" },
      ],
      targetItems: [{ id: "9", label: "Grape" }],
    })
    return (
      <div className="space-y-2">
        <Transfer {...state} onItemsChange={setState} />
        <p className="text-xs text-muted-foreground">Left: {state.sourceItems.length} / Right: {state.targetItems.length}</p>
      </div>
    )
  },
}

export const MoveBetweenLists: Story = {
  render: Controlled.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Apple" }))
    await userEvent.click(canvas.getByRole("button", { name: ">" }))
    await waitFor(() => {
      expect(canvas.getByText(/Right: 2/i)).toBeInTheDocument()
    })
    await userEvent.click(canvas.getByRole("button", { name: "Apple" }))
    await userEvent.click(canvas.getByRole("button", { name: "<" }))
    await waitFor(() => {
      expect(canvas.getByText(/Right: 1/i)).toBeInTheDocument()
    })
  },
}
