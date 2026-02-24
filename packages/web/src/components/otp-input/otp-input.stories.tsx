import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { OTPInput } from "./otp-input"

const OTPDemo = () => {
  const [code, setCode] = React.useState("")
  return (
    <div className="space-y-3">
      <OTPInput value={code} onValueChange={setCode} />
      <p className="text-sm text-muted-foreground">Code: {code || "empty"}</p>
    </div>
  )
}

const meta = {
  title: "Forms/OTPInput",
  component: OTPInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OTPInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Forms</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">OTP Input Showcase</h2>
          <p className="text-sm text-muted-foreground">One-time code entry with keyboard and paste support.</p>
        </div>
        <OTPDemo />
      </div>
    </div>
  ),
}

export const TypeAndPaste: Story = {
  render: () => <OTPDemo />,
  play: async ({ canvas }) => {
    const first = canvas.getByRole("textbox", { name: /digit 1/i })
    fireEvent.change(first, { target: { value: "1" } })

    const second = canvas.getByRole("textbox", { name: /digit 2/i })
    fireEvent.change(second, { target: { value: "2" } })
    fireEvent.change(canvas.getByRole("textbox", { name: /digit 3/i }), { target: { value: "3" } })
    fireEvent.change(canvas.getByRole("textbox", { name: /digit 4/i }), { target: { value: "4" } })
    fireEvent.change(canvas.getByRole("textbox", { name: /digit 5/i }), { target: { value: "5" } })
    fireEvent.change(canvas.getByRole("textbox", { name: /digit 6/i }), { target: { value: "6" } })

    await waitFor(() => {
      expect(canvas.getByText(/code: 123456/i)).toBeInTheDocument()
    })
  },
}

export const KeyboardEditing: Story = {
  render: () => <OTPDemo />,
  play: async ({ canvas }) => {
    const first = canvas.getByRole("textbox", { name: /digit 1/i })
    const second = canvas.getByRole("textbox", { name: /digit 2/i })
    const third = canvas.getByRole("textbox", { name: /digit 3/i })

    fireEvent.change(first, { target: { value: "1" } })
    fireEvent.change(second, { target: { value: "2" } })
    fireEvent.change(third, { target: { value: "3" } })

    await waitFor(() => {
      expect(canvas.getByText(/code: 123/i)).toBeInTheDocument()
    })

    fireEvent.keyDown(third, { key: "Backspace" })
    await waitFor(() => {
      expect(canvas.getByText(/code: 12/i)).toBeInTheDocument()
    })

    fireEvent.keyDown(third, { key: "Backspace" })
    await waitFor(() => {
      expect(canvas.getByText(/code: 1/i)).toBeInTheDocument()
      expect(second).toHaveFocus()
    })

    fireEvent.keyDown(second, { key: "ArrowRight" })
    await expect(third).toHaveFocus()
    fireEvent.keyDown(third, { key: "ArrowLeft" })
    await expect(second).toHaveFocus()

    const pasteEvent = new Event("paste", { bubbles: true, cancelable: true })
    Object.defineProperty(pasteEvent, "clipboardData", {
      value: { getData: () => "987654" },
    })
    fireEvent(second, pasteEvent)

    await waitFor(() => {
      expect(canvas.getByText(/code: 987654/i)).toBeInTheDocument()
    })
  },
}
