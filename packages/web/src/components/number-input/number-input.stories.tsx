import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { NumberInput } from "./number-input"

const NumberInputDemo = () => {
  const [quantity, setQuantity] = React.useState(2)
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-card-foreground" htmlFor="quantity-input">
        Quantity
      </label>
      <NumberInput id="quantity-input" aria-label="Quantity" value={quantity} onValueChange={setQuantity} min={0} max={10} step={1} />
      <p className="text-sm text-foreground/80" data-testid="quantity-value">Quantity: {quantity}</p>
    </div>
  )
}

const meta = {
  title: "Forms/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Forms</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Number Input Showcase</h2>
          <p className="text-sm text-muted-foreground">Numeric input with step controls and boundary constraints.</p>
        </div>
        <NumberInputDemo />
      </div>
    </div>
  ),
}

export const StepAndClamp: Story = {
  render: () => <NumberInputDemo />,
  play: async ({ canvas }) => {
    const increment = canvas.getByRole("button", { name: /increase value/i })
    const input = canvas.getByRole("textbox")

    fireEvent.click(increment)
    await waitFor(() => {
      expect(canvas.getByText(/quantity: 3/i)).toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: "99" } })
    fireEvent.keyDown(input, { key: "Enter" })
    await waitFor(() => {
      expect(canvas.getByText(/quantity: 10/i)).toBeInTheDocument()
    })

    fireEvent.change(input, { target: { value: "-5" } })
    fireEvent.keyDown(input, { key: "Enter" })
    await waitFor(() => {
      expect(input).toHaveValue("0")
      expect(canvas.getByTestId("quantity-value")).toHaveTextContent(/quantity: 0/i)
    })
  },
}

export const KeyboardAndValidation: Story = {
  render: () => <NumberInputDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox")

    fireEvent.keyDown(input, { key: "ArrowUp" })
    await waitFor(() => {
      expect(canvas.getByTestId("quantity-value")).toHaveTextContent(/quantity: 3/i)
    })

    fireEvent.keyDown(input, { key: "ArrowDown" })
    await waitFor(() => {
      expect(canvas.getByTestId("quantity-value")).toHaveTextContent(/quantity: 2/i)
    })

    fireEvent.change(input, { target: { value: "12abc" } })
    await expect(input).toHaveValue("2")

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "-" } })
    fireEvent.blur(input)
    await waitFor(() => {
      expect(canvas.getByTestId("quantity-value")).toHaveTextContent(/quantity: 2/i)
    })
  },
}

export const DisabledState: Story = {
  render: () => (
    <div className="space-y-3">
      <NumberInput aria-label="Disabled quantity" defaultValue={4} disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: /disabled quantity/i })
    const increase = canvas.getByRole("button", { name: /increase value/i })
    const decrease = canvas.getByRole("button", { name: /decrease value/i })

    await expect(input).toBeDisabled()
    await expect(increase).toBeDisabled()
    await expect(decrease).toBeDisabled()
  },
}

export const UncontrolledBlurCommit: Story = {
  render: () => (
    <div className="space-y-3">
      <label className="text-sm font-medium text-card-foreground" htmlFor="budget-input">
        Budget
      </label>
      <NumberInput id="budget-input" aria-label="Budget" defaultValue={3} min={0} max={10} />
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: /budget/i })
    const increase = canvas.getByRole("button", { name: /increase value/i })

    fireEvent.click(increase)
    await waitFor(() => {
      expect(input).toHaveValue("4")
    })

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "7" } })
    fireEvent.focusOut(input)
    await waitFor(() => {
      expect(input).toHaveValue("7")
    })

    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: "-" } })
    fireEvent.focusOut(input)
    await waitFor(() => {
      expect(input).toHaveValue("7")
    })
  },
}
