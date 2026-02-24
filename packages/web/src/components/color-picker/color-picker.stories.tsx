import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { ColorPicker } from "./color-picker"

const meta = {
  title: "Input/ColorPicker",
  component: ColorPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [color, setColor] = React.useState("#3b82f6")
    return (
      <div className="space-y-4">
        <ColorPicker value={color} onChange={setColor} />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border" style={{ backgroundColor: color }} />
          <span className="text-sm">{color}</span>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const sliders = canvas.getAllByRole("slider")
    ;["20", "80", "140", "200", "260", "320"].forEach((hue) => {
      fireEvent.change(sliders[0], { target: { value: hue } })
    })
    fireEvent.change(sliders[1], { target: { value: "80" } })
    fireEvent.change(sliders[2], { target: { value: "50" } })

    const input = canvas.getByPlaceholderText("#000000")
    fireEvent.change(input, { target: { value: "#GGGGGG" } })
    fireEvent.change(input, { target: { value: "#00ff00" } })

    await waitFor(() => {
      expect(canvas.getByText("#00ff00")).toBeInTheDocument()
    })
  },
}

export const WithoutInput: Story = {
  render: () => {
    const [color, setColor] = React.useState("#ef4444")
    return (
      <div className="space-y-4">
        <ColorPicker value={color} onChange={setColor} showInput={false} />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded border" style={{ backgroundColor: color }} />
          <span className="text-sm">{color}</span>
        </div>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByPlaceholderText("#000000")).not.toBeInTheDocument()
    const sliders = canvas.getAllByRole("slider")
    const initialHue = Number((sliders[0] as HTMLInputElement).value)
    fireEvent.change(sliders[0], { target: { value: "250" } })
    await waitFor(() => {
      const updatedHue = Number((sliders[0] as HTMLInputElement).value)
      expect(updatedHue).toBeGreaterThan(200)
      expect(updatedHue).not.toBe(initialHue)
    })
  },
}

export const PresetColors: Story = {
  render: () => {
    const [color, setColor] = React.useState("#8b5cf6")
    const presets = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

    return (
      <div className="space-y-4">
        <ColorPicker value={color} onChange={setColor} />
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setColor(preset)}
              className="h-8 w-8 rounded border-2 hover:scale-110 transition-transform"
              style={{ backgroundColor: preset, borderColor: preset === color ? "#000" : "transparent" }}
              aria-label={`Select ${preset}`}
            />
          ))}
        </div>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [color] = React.useState("#6366f1")
    return <ColorPicker value={color} disabled />
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getAllByRole("slider").forEach((slider) => expect(slider).toBeDisabled())
  },
}
