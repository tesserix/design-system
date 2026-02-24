import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Badge } from './badge'

const meta = {
  title: 'Feedback/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'],
      description: 'The visual style variant of the badge',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the badge',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-medium text-primary">Status Indicators</p>
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Badge Showcase</h2>
            <p className="text-sm text-muted-foreground">Small status indicators for labels and tags.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">Status Examples</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success">Active</Badge>
                  <Badge variant="warning">Pending</Badge>
                  <Badge variant="destructive">Cancelled</Badge>
                  <Badge variant="secondary">Draft</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Content</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-card-foreground">Status:</span>
                    <Badge variant="success">Deployed</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-card-foreground">Priority:</span>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-card-foreground">Version:</span>
                    <Badge variant="outline">v2.4.1</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Error',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
}

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
