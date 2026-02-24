import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { InlineEditable } from "./inline-editable"

const InlineEditableDemo = () => {
  const [name, setName] = React.useState("Tesserix Dashboard")
  return (
    <div className="space-y-3">
      <InlineEditable value={name} onValueChange={setName} label="Project name" />
      <p className="text-sm text-muted-foreground">Current value: {name}</p>
    </div>
  )
}

const meta = {
  title: "Forms/InlineEditable",
  component: InlineEditable,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineEditable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Forms</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Inline Editable Showcase</h2>
          <p className="text-sm text-muted-foreground">Edit labels and titles directly in-place.</p>
        </div>
        <InlineEditableDemo />
      </div>
    </div>
  ),
}

export const EditValue: Story = {
  render: () => <InlineEditableDemo />,
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /project name/i })
    fireEvent.click(button)

    const input = await waitFor(() => canvas.getByRole("textbox"))
    fireEvent.change(input, { target: { value: "Tesserix Admin" } })
    fireEvent.keyDown(input, { key: "Enter" })

    await waitFor(() => {
      expect(canvas.getByText(/current value: tesserix admin/i)).toBeInTheDocument()
    })
  },
}

export const CancelAndBlur: Story = {
  render: () => (
    <div className="space-y-3">
      <InlineEditable defaultValue="Initial Name" label="Project name" />
      <p className="text-sm text-muted-foreground">Uncontrolled editable field</p>
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /project name/i })
    fireEvent.click(button)

    const input = await waitFor(() => canvas.getByRole("textbox", { name: /project name/i }))
    fireEvent.change(input, { target: { value: "Temp Name" } })
    fireEvent.keyDown(input, { key: "Escape" })

    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /project name/i })).toHaveTextContent(/initial name/i)
    })

    fireEvent.click(canvas.getByRole("button", { name: /project name/i }))
    const inputAgain = await waitFor(() => canvas.getByRole("textbox", { name: /project name/i }))
    fireEvent.change(inputAgain, { target: { value: "Blur Save" } })
    fireEvent.click(canvas.getByRole("button", { name: /save value/i }))
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: /project name/i })).toHaveTextContent(/blur save/i)
    })
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="space-y-3">
      <InlineEditable value="Read Only Name" label="Project name" disabled />
      <p className="text-sm text-muted-foreground">No editing expected</p>
    </div>
  ),
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /project name/i })
    await expect(button).toBeDisabled()
    fireEvent.click(button)
    await expect(canvas.queryByRole("textbox", { name: /project name/i })).not.toBeInTheDocument()
  },
}
