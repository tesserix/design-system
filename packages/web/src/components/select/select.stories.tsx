import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent } from 'storybook/test'
import { Select } from './select'
import { Label } from '../label'

const meta = {
  title: 'Forms/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the select is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The default selected value',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: 'The option elements',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the select',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const ControlledSelectDemo = () => {
  const [value, setValue] = React.useState("medium")

  return (
    <div className="w-[320px] space-y-2">
      <Label htmlFor="controlled-select">Priority</Label>
      <Select id="controlled-select" value={value} onChange={(event) => setValue(event.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
      <p className="text-sm text-muted-foreground">Current priority: {value}</p>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Dropdown Selection</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Select Showcase</h2>
          <p className="text-sm text-muted-foreground">Dropdown menus for choosing from multiple options.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select id="country" defaultValue="us">
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select id="language" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ja">Japanese</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select id="timezone">
              <option value="">Select timezone</option>
              <optgroup label="North America">
                <option value="est">Eastern Time</option>
                <option value="cst">Central Time</option>
                <option value="mst">Mountain Time</option>
                <option value="pst">Pacific Time</option>
              </optgroup>
              <optgroup label="Europe">
                <option value="gmt">GMT</option>
                <option value="cet">Central European Time</option>
              </optgroup>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Disabled State</h3>
            <div className="space-y-2">
              <Label htmlFor="disabled-select">Disabled Select</Label>
              <Select id="disabled-select" disabled defaultValue="option1">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="select-example">Choose an option</Label>
      <Select id="select-example">
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled defaultValue="1" aria-label="Disabled select dropdown">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </Select>
  ),
}

export const WithOptgroups: Story = {
  render: () => (
    <Select className="w-[300px]" aria-label="Fruit selection">
      <option value="">Select a fruit</option>
      <optgroup label="Citrus">
        <option value="orange">Orange</option>
        <option value="lemon">Lemon</option>
      </optgroup>
      <optgroup label="Berries">
        <option value="strawberry">Strawberry</option>
        <option value="blueberry">Blueberry</option>
      </optgroup>
    </Select>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const KeyboardAndA11y: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="a11y-select">Priority</Label>
      <Select id="a11y-select" defaultValue="medium">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
    </div>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByLabelText(/priority/i) as HTMLSelectElement
    await expect(select).toHaveValue("medium")

    fireEvent.change(select, { target: { value: "high" } })
    await expect(select).toHaveValue("high")
  },
}

export const Controlled: Story = {
  render: () => <ControlledSelectDemo />,
  play: async ({ canvas }) => {
    const select = canvas.getByLabelText(/priority/i) as HTMLSelectElement
    await expect(select).toHaveValue("medium")
    fireEvent.change(select, { target: { value: "high" } })
    await expect(canvas.getByText(/current priority: high/i)).toBeInTheDocument()
  },
}

export const InvalidState: Story = {
  render: () => (
    <div className="w-[320px] space-y-2">
      <Label htmlFor="invalid-select">Environment</Label>
      <Select id="invalid-select" aria-invalid="true" defaultValue="" className="border-destructive focus-visible:border-destructive">
        <option value="">Select environment</option>
        <option value="dev">Development</option>
        <option value="staging">Staging</option>
        <option value="prod">Production</option>
      </Select>
      <p className="text-xs text-destructive">Please select an environment.</p>
    </div>
  ),
}
