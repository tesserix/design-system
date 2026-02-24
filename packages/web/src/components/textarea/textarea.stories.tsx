import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Textarea } from './textarea'
import { Label } from '../label'
import { Button } from '../button'

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when textarea is empty',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    rows: {
      control: 'number',
      description: 'Number of visible text rows',
      table: {
        type: { summary: 'number' },
      },
    },
    maxLength: {
      control: 'number',
      description: 'Maximum number of characters allowed',
      table: {
        type: { summary: 'number' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the textarea',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Type your message here...',
  },
  render: (args) => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Multi-line Input</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Textarea Showcase</h2>
          <p className="text-sm text-muted-foreground">Multi-line text inputs for longer content.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea {...args} id="message" placeholder="Share your thoughts..." />
            <p className="text-xs text-muted-foreground">Your message will be visible to the team.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea id="description" rows={5} placeholder="Describe your project in detail..." />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label htmlFor="bio">Biography</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    placeholder: 'This textarea is disabled',
    disabled: true,
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'This is a pre-filled textarea with some content that spans multiple lines.\n\nYou can edit this text or replace it entirely.',
    readOnly: false,
  },
}

export const WithMaxLength: Story = {
  render: () => (
    <div className="w-[500px] space-y-2">
      <Label htmlFor="tweet">Tweet (max 280 characters)</Label>
      <Textarea id="tweet" maxLength={280} placeholder="What's happening?" />
      <p className="text-xs text-muted-foreground">280 characters maximum</p>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
