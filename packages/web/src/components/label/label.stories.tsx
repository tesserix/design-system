import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Label } from './label'
import { Input } from '../input'

const meta = {
  title: 'Forms/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'muted'],
      description: 'The visual style variant of the label',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the label',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the label',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Email Address',
  },
  render: (args) => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Form Labels</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Label Showcase</h2>
          <p className="text-sm text-muted-foreground">Accessible form labels that connect to inputs.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label {...args} htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>

          <div className="space-y-2">
            <Label variant="muted" htmlFor="optional">Optional Field</Label>
            <Input id="optional" placeholder="This field is optional" />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Muted: Story = {
  args: {
    children: 'Optional Information',
    variant: 'muted',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter your username" />
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="required-field">
        Full Name <span className="text-destructive">*</span>
      </Label>
      <Input id="required-field" required placeholder="John Doe" />
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
