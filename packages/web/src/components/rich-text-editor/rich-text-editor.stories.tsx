import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test"

import { RichTextEditor } from "./rich-text-editor"

const meta = {
  title: "Input/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
} satisfies Meta<typeof RichTextEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("<p>Start writing...</p>")
    return (
      <div className="w-[640px] space-y-3">
        <RichTextEditor value={value} onValueChange={setValue} />
        <div className="rounded-md border p-2 text-xs text-muted-foreground">Output: {value}</div>
      </div>
    )
  },
}

export const EditingFlow: Story = {
  render: Controlled.render,
  play: async ({ canvasElement }) => {
    if (typeof document.execCommand !== "function") {
      ;(document as Document & { execCommand: (command: string) => boolean }).execCommand = () => true
    }

    const canvas = within(canvasElement)
    const textbox = canvas.getByRole("textbox")
    textbox.focus()
    await userEvent.type(textbox, "Hello")

    fireEvent.click(canvas.getByRole("button", { name: "B" }))
    fireEvent.click(canvas.getByRole("button", { name: "I" }))
    fireEvent.click(canvas.getByRole("button", { name: "U" }))

    await waitFor(() => {
      expect(canvas.getByText(/Output:/i)).toBeInTheDocument()
    })
  },
}
