import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { MarkdownEditor } from "./markdown-editor"

const meta = {
  title: "Input/MarkdownEditor",
  component: MarkdownEditor,
  tags: ["autodocs"],
  args: {
    defaultValue: "# Hello\n**Bold text**",
  },
} satisfies Meta<typeof MarkdownEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("# Notes\n* start here")
    return (
      <div className="space-y-2">
        <MarkdownEditor value={value} onValueChange={setValue} />
        <div className="rounded border p-2 text-xs text-muted-foreground">Length: {value.length}</div>
      </div>
    )
  },
}

export const HeadingAndInlineFormatting: Story = {
  args: {
    defaultValue: "# Heading\n## Subheading\n**Bold** and *Italic*",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText("Heading", { selector: "h1" })).toBeInTheDocument()
    await expect(canvas.getByText("Subheading", { selector: "h2" })).toBeInTheDocument()
    await expect(canvas.getByText("Bold", { selector: "strong" })).toBeInTheDocument()
    await expect(canvas.getByText("Italic", { selector: "em" })).toBeInTheDocument()
  },
}

export const EditingFlow: Story = {
  render: Controlled.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole("textbox")

    fireEvent.change(textarea, { target: { value: "## Updated\nnew line" } })

    await waitFor(() => {
      expect(canvas.getByText("Updated", { selector: "h2" })).toBeInTheDocument()
      expect(canvas.getByText(/Length:/i)).toBeInTheDocument()
    })
  },
}
