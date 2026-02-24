import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { TimePicker } from "./time-picker"

const meta = {
  title: "Input/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>

const DEFAULT_TIME = new Date(2024, 0, 1, 23, 56, 20)
const FORMAT_12H_TIME = new Date(2024, 0, 1, 11, 56, 23)
const WITH_SECONDS_TIME = new Date(2024, 0, 1, 8, 12, 5)
const FORMAT_12H_WITH_SECONDS_TIME = new Date(2024, 0, 1, 10, 32, 2)

const formatTime = (value: Date, format: "12h" | "24h", showSeconds = false) => {
  const hours24 = value.getHours()
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const hours = format === "12h" ? hours12 : hours24
  const minutes = value.getMinutes()
  const seconds = value.getSeconds()
  const period = hours24 >= 12 ? "PM" : "AM"
  const hh = String(hours).padStart(2, "0")
  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")

  return `${hh}:${mm}${showSeconds ? `:${ss}` : ""}${format === "12h" ? ` ${period}` : ""}`
}

export const Default: Story = {
  render: () => {
    const [time, setTime] = React.useState<Date | undefined>(new Date(DEFAULT_TIME))
    return (
      <div className="space-y-2">
        <TimePicker value={time} onChange={setTime} />
        {time && (
          <p className="text-sm text-muted-foreground">
            Selected: {formatTime(time, "24h")}
          </p>
        )}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const hours = canvas.getByLabelText("Hours") as HTMLInputElement
    const minutes = canvas.getByLabelText("Minutes") as HTMLInputElement

    fireEvent.input(hours, { target: { value: "14" } })
    fireEvent.change(hours, { target: { value: "14" } })
    fireEvent.input(minutes, { target: { value: "35" } })
    fireEvent.change(minutes, { target: { value: "35" } })

    await waitFor(() => {
      expect(hours.value).toBe("14")
      expect(minutes.value).toBe("35")
    })
  },
}

export const Format12Hour: Story = {
  render: () => {
    const [time, setTime] = React.useState<Date | undefined>(new Date(FORMAT_12H_TIME))
    return (
      <div className="space-y-2">
        <TimePicker value={time} onChange={setTime} format="12h" />
        {time && (
          <p className="text-sm text-muted-foreground">
            Selected: {formatTime(time, "12h")}
          </p>
        )}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: "Toggle AM/PM" })
    const initialPeriod = toggle.textContent
    fireEvent.click(toggle)
    await waitFor(() => {
      expect(toggle.textContent).not.toBe(initialPeriod)
      expect(toggle).toHaveTextContent(/am|pm/i)
    })
  },
}

export const WithSeconds: Story = {
  render: () => {
    const [time, setTime] = React.useState<Date | undefined>(new Date(WITH_SECONDS_TIME))
    return (
      <div className="space-y-2">
        <TimePicker value={time} onChange={setTime} showSeconds />
        {time && (
          <p className="text-sm text-muted-foreground">
            Selected: {formatTime(time, "24h", true)}
          </p>
        )}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    fireEvent.change(canvas.getByLabelText("Seconds"), { target: { value: "45" } })
    await waitFor(() => {
      expect(canvas.getByText(/Selected:/i)).toBeInTheDocument()
    })
  },
}

export const Format12HourWithSeconds: Story = {
  render: () => {
    const [time, setTime] = React.useState<Date | undefined>(new Date(FORMAT_12H_WITH_SECONDS_TIME))
    return (
      <div className="space-y-2">
        <TimePicker value={time} onChange={setTime} format="12h" showSeconds />
        {time && (
          <p className="text-sm text-muted-foreground">
            Selected: {formatTime(time, "12h", true)}
          </p>
        )}
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    fireEvent.change(canvas.getByLabelText("Hours"), { target: { value: "11" } })
    fireEvent.change(canvas.getByLabelText("Minutes"), { target: { value: "58" } })
    fireEvent.change(canvas.getByLabelText("Seconds"), { target: { value: "59" } })
    fireEvent.click(canvas.getByRole("button", { name: "Toggle AM/PM" }))
    await waitFor(() => {
      expect(canvas.getByText(/Selected:/i)).toBeInTheDocument()
    })
  },
}

export const Disabled: Story = {
  render: () => {
    const [time] = React.useState<Date | undefined>(new Date(DEFAULT_TIME))
    return (
      <div className="space-y-2">
        <TimePicker value={time} disabled />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByLabelText("Hours")).toBeDisabled()
    expect(canvas.getByLabelText("Minutes")).toBeDisabled()
  },
}
