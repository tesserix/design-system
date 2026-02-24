import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { Autocomplete } from "./autocomplete"

const options = [
  { value: "react", label: "React", keywords: ["ui", "frontend"] },
  { value: "next", label: "Next.js", keywords: ["react", "framework"] },
  { value: "vite", label: "Vite", keywords: ["build", "tooling"] },
  { value: "ts", label: "TypeScript", keywords: ["types", "javascript"] },
]

const meta = {
  title: "Input/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  args: {
    options,
    placeholder: "Search technology...",
  },
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("")
    const [selected, setSelected] = React.useState("")
    return (
      <div className="w-96 space-y-2">
        <Autocomplete
          options={options}
          value={value}
          onValueChange={setValue}
          onOptionSelect={(option) => setSelected(option.value)}
          placeholder="Search stack..."
        />
        <p className="text-xs text-muted-foreground">Value: {value || "none"}</p>
        <p className="text-xs text-muted-foreground">Selected: {selected || "none"}</p>
      </div>
    )
  },
}

export const KeyboardSelection: Story = {
  render: Controlled.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("combobox")

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "re" } })
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "Enter" })

    await waitFor(() => {
      expect(canvas.getByText(/selected:/i)).toBeInTheDocument()
      expect(canvas.getByText(/value:/i)).toBeInTheDocument()
    })
  },
}

export const EmptyState: Story = {
  args: {
    defaultValue: "zzzz",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "React",
  },
}

export const KeywordMatch: Story = {
  render: Controlled.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("combobox")
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "framework" } })

    await waitFor(() => {
      expect(canvas.getByRole("option", { name: "Next.js" })).toBeInTheDocument()
    })
  },
}
