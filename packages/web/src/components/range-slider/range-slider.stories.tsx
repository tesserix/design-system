import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test"

import { RangeSlider } from "./range-slider"

const meta = {
  title: "Input/RangeSlider",
  component: RangeSlider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RangeSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [range, setRange] = React.useState<[number, number]>([25, 75])
    return (
      <div className="w-96 space-y-4">
        <RangeSlider value={range} onChange={setRange} />
        <p className="text-sm text-center text-muted-foreground">Range: {range[0]} - {range[1]}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const minHandle = canvas.getByLabelText("Minimum value")
    const track = minHandle.parentElement as HTMLDivElement

    track.getBoundingClientRect = () =>
      ({ left: 0, width: 200, top: 0, right: 200, bottom: 10, height: 10 }) as DOMRect

    fireEvent.mouseDown(minHandle, { clientX: 40 })
    fireEvent.mouseMove(document, { clientX: 80 })
    fireEvent.mouseUp(document)

    fireEvent.click(track, { clientX: 170, target: track })

    await waitFor(() => {
      expect(canvas.getByText(/Range:/i)).toBeInTheDocument()
    })
  },
}

export const CustomRange: Story = {
  render: () => {
    const [range, setRange] = React.useState<[number, number]>([200, 800])
    return (
      <div className="w-96 space-y-4">
        <RangeSlider min={0} max={1000} value={range} onChange={setRange} />
        <p className="text-sm text-center text-muted-foreground">Range: {range[0]} - {range[1]}</p>
      </div>
    )
  },
}

export const WithStep: Story = {
  render: () => {
    const [range, setRange] = React.useState<[number, number]>([20, 80])
    return (
      <div className="w-96 space-y-4">
        <RangeSlider min={0} max={100} step={10} value={range} onChange={setRange} />
        <p className="text-sm text-center text-muted-foreground">Range: {range[0]} - {range[1]} (Step: 10)</p>
      </div>
    )
  },
}

export const PriceRange: Story = {
  render: () => {
    const [range, setRange] = React.useState<[number, number]>([50, 500])
    return (
      <div className="w-96 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <RangeSlider min={0} max={1000} step={10} value={range} onChange={setRange} />
        </div>
        <div className="flex justify-between text-sm">
          <span>${range[0]}</span>
          <span>${range[1]}</span>
        </div>
      </div>
    )
  },
}

export const WithoutLabels: Story = {
  render: () => {
    const [range, setRange] = React.useState<[number, number]>([30, 70])
    return (
      <div className="w-96">
        <RangeSlider value={range} onChange={setRange} showLabels={false} />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    const [range] = React.useState<[number, number]>([40, 60])
    return (
      <div className="w-96">
        <RangeSlider value={range} disabled />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const minHandle = canvas.getByLabelText("Minimum value")
    expect(minHandle).toHaveAttribute("tabindex", "-1")
    fireEvent.mouseDown(minHandle, { clientX: 10 })
    fireEvent.mouseMove(document, { clientX: 80 })
    fireEvent.mouseUp(document)
    await expect(canvas.getByText("40")).toBeInTheDocument()
  },
}

export const UncontrolledEdgeCases: Story = {
  render: () => {
    const [mounted, setMounted] = React.useState(true)
    const [disabled, setDisabled] = React.useState(false)

    return (
      <div className="w-96 space-y-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => setDisabled((prev) => !prev)}>
            Toggle disabled
          </button>
          <button type="button" onClick={() => setMounted(false)}>
            Unmount slider
          </button>
        </div>
        {mounted ? <RangeSlider defaultValue={[30, 60]} disabled={disabled} /> : <p>Unmounted</p>}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const minHandle = await canvas.findByLabelText("Minimum value")
    const maxHandle = await canvas.findByLabelText("Maximum value")
    const track = minHandle.parentElement as HTMLDivElement
    const fill = track.querySelector("div.absolute.h-full.rounded-full.bg-primary") as HTMLDivElement | null

    track.getBoundingClientRect = () =>
      ({ left: 0, width: 200, top: 0, right: 200, bottom: 10, height: 10 }) as DOMRect

    fireEvent.mouseDown(maxHandle, { clientX: 120 })
    fireEvent.mouseMove(document, { clientX: 180 })

    await userEvent.click(canvas.getByRole("button", { name: "Toggle disabled" }))
    fireEvent.mouseMove(document, { clientX: 160 })
    fireEvent.mouseUp(document)

    fireEvent.click(track, { clientX: 50, target: fill ?? track })
    fireEvent.mouseDown(minHandle, { clientX: 40 })
    await userEvent.click(canvas.getByRole("button", { name: "Unmount slider" }))
    fireEvent.mouseMove(document, { clientX: 10 })
    fireEvent.mouseUp(document)

    await expect(canvas.getByText("Unmounted")).toBeInTheDocument()
  },
}
