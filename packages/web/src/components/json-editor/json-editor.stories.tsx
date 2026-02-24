import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, userEvent, within } from "storybook/test"

import { JsonEditor } from "./json-editor"

const meta = {
  title: "Patterns/JsonEditor",
  component: JsonEditor,
  tags: ["autodocs"],
  args: {
    value: { name: "alpha", enabled: true, retries: 3 },
  },
} satisfies Meta<typeof JsonEditor>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmokeTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(canvas.getByLabelText("JSON editor"))
    fireEvent.change(canvas.getByLabelText("JSON editor"), { target: { value: "{bad" } })
    await expect(canvas.getByText(/expected property name/i)).toBeInTheDocument()
  },
}
