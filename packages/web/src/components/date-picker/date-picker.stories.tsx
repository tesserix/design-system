import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { DatePicker } from "./date-picker"

const DatePickerDemo = () => {
  const [value, setValue] = React.useState<string>("")
  return (
    <div className="space-y-3">
      <DatePicker value={value} onValueChange={setValue} />
      <p className="text-sm text-muted-foreground">Selected value: {value || "None"}</p>
    </div>
  )
}

const meta = {
  title: "Forms/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "DatePicker supports controlled/uncontrolled modes, month navigation, keyboard date navigation, and outside-dismiss behavior.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Forms</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Date Picker Showcase</h2>
          <p className="text-sm text-muted-foreground">Calendar-based date selection with keyboard navigation.</p>
        </div>

        <DatePickerDemo />
      </div>
    </div>
  ),
}

export const SelectDate: Story = {
  render: () => <DatePickerDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /select date/i })
    fireEvent.click(trigger)

    // Wait for popover to appear (renders in document.body as portal)
    await waitFor(() => {
      const popover = within(document.body).getByRole("dialog")
      expect(popover).toBeInTheDocument()
    })

    // Check month label exists in the calendar
    const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date())
    await waitFor(() => {
      expect(within(document.body).getByText(monthLabel)).toBeInTheDocument()
    })

    // Click today's date
    const today = new Date().getDate().toString()
    const todayButton = within(document.body).getAllByRole("gridcell", { name: today })[0]
    fireEvent.click(todayButton)

    // Check selected value is displayed
    await waitFor(() => {
      expect(canvas.getByText(/selected value: \d{4}-\d{2}-\d{2}/i)).toBeInTheDocument()
    })
  },
}

export const KeyboardAndMonthNavigation: Story = {
  render: () => <DatePickerDemo />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /select date/i })
    fireEvent.click(trigger)

    const dialog = await waitFor(() => within(document.body).getByRole("dialog"))
    const monthLabel = within(dialog).getByText(/\w+\s+\d{4}/i).textContent

    fireEvent.click(within(dialog).getByRole("button", { name: /next month/i }))
    await waitFor(() => {
      expect(within(document.body).getByRole("dialog")).toBeInTheDocument()
      expect(within(document.body).queryByText(monthLabel ?? "")).not.toBeInTheDocument()
    })

    fireEvent.click(within(document.body).getByRole("button", { name: /previous month/i }))
    await waitFor(() => {
      expect(within(document.body).getByText(monthLabel ?? "")).toBeInTheDocument()
    })

    const activeDialog = within(document.body).getByRole("dialog")
    fireEvent.keyDown(activeDialog, { key: "ArrowRight" })
    fireEvent.keyDown(activeDialog, { key: "ArrowLeft" })
    fireEvent.keyDown(activeDialog, { key: "ArrowUp" })
    fireEvent.keyDown(activeDialog, { key: "ArrowDown" })
    fireEvent.keyDown(activeDialog, { key: "Enter" })

    await waitFor(() => {
      expect(canvas.getByText(/selected value: \d{4}-\d{2}-\d{2}/i)).toBeInTheDocument()
    })

    fireEvent.click(trigger)
    const reopened = await waitFor(() => within(document.body).getByRole("dialog"))
    fireEvent.keyDown(reopened, { key: "Escape" })
    await waitFor(() => {
      expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument()
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[860px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Default</p>
        <DatePicker />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Preset Value</p>
        <DatePicker defaultValue="2026-01-15" />
      </div>
      <div className="rounded-xl border bg-card p-4 md:col-span-2">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Disabled</p>
        <DatePicker disabled placeholder="Unavailable" />
      </div>
    </div>
  ),
}
