import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent } from 'storybook/test'
import { Input } from './input'
import { Button } from '../button'

const meta = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url', 'date', 'time', 'datetime-local', 'file'],
      description: 'The type of input field',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when input is empty',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: 'text',
      description: 'The controlled value of the input',
      table: {
        type: { summary: 'string | number' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The default uncontrolled value of the input',
      table: {
        type: { summary: 'string | number' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed',
      table: {
        type: { summary: 'number' },
      },
    },
    minLength: {
      control: 'number',
      description: 'Minimum number of characters required',
      table: {
        type: { summary: 'number' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the input',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

const ControlledInputDemo = () => {
  const [value, setValue] = React.useState('Initial value')

  return (
    <div className="w-[360px] space-y-3">
      <label htmlFor="controlled-input" className="text-sm font-medium text-card-foreground">
        Controlled input
      </label>
      <Input
        id="controlled-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Type to update state"
      />
      <p className="text-sm text-muted-foreground">Current value: {value}</p>
    </div>
  )
}

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  render: (args) => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Form Controls</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Input Field Showcase</h2>
          <p className="text-sm text-muted-foreground">Structured examples for focused, readable, production-ready forms.</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Project Name</label>
            <Input {...args} placeholder="New Marketing Site" />
            <p className="text-xs text-muted-foreground">Used in navigation, reports, and team activity.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Workspace URL</label>
            <Input type="url" placeholder="https://workspace.example.com" />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="outline">Cancel</Button>
            <Button>Save Settings</Button>
          </div>
        </div>
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText(/new marketing site/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'Customer Portal')
    await expect(input).toHaveValue('Customer Portal')
  },
}

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email',
    'aria-label': 'Email address',
  },
}

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter your password',
    'aria-label': 'Password',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    'aria-label': 'Disabled input field',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText(/disabled input/i)
    await expect(input).toBeDisabled()
  },
}

export const WithValue: Story = {
  args: {
    value: 'Pre-filled value',
    readOnly: true,
    'aria-label': 'Pre-filled value',
  },
}

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
    'aria-label': 'Number input',
  },
}

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
    'aria-label': 'Search',
  },
}

export const ValidationStates: Story = {
  render: () => (
    <div className="w-[360px] space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="required-input" className="text-sm font-medium">
          Required field
        </label>
        <Input id="required-input" placeholder="Project title" required />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="invalid-input" className="text-sm font-medium">
          Invalid field
        </label>
        <Input
          id="invalid-input"
          aria-invalid="true"
          defaultValue="bad-email"
          className="border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="readonly-input" className="text-sm font-medium">
          Read-only field
        </label>
        <Input id="readonly-input" defaultValue="Read-only value" readOnly />
      </div>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => <ControlledInputDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/controlled input/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'Controlled from story')
    await expect(canvas.getByText(/current value: controlled from story/i)).toBeInTheDocument()
  },
}
