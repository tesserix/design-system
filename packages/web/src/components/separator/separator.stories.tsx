import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Separator } from './separator'

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'horizontal' },
      },
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is decorative (not semantic)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the separator',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-medium text-primary">Visual Dividers</p>
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Separator Showcase</h2>
            <p className="text-sm text-muted-foreground">Dividers for organizing content sections.</p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-card-foreground">Horizontal</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium">Section One</h4>
                  <p className="text-sm text-muted-foreground">Content for the first section.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium">Section Two</h4>
                  <p className="text-sm text-muted-foreground">Content for the second section.</p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium">Section Three</h4>
                  <p className="text-sm text-muted-foreground">Content for the third section.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-card-foreground">Vertical</h3>
              <div className="flex h-20 items-center space-x-4">
                <div className="text-sm">Item 1</div>
                <Separator orientation="vertical" />
                <div className="text-sm">Item 2</div>
                <Separator orientation="vertical" />
                <div className="text-sm">Item 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <p className="text-sm">Above separator</p>
      </div>
      <Separator />
      <div>
        <p className="text-sm">Below separator</p>
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-20 items-center space-x-4">
      <div className="text-sm">Left</div>
      <Separator orientation="vertical" />
      <div className="text-sm">Right</div>
    </div>
  ),
}

export const InMenu: Story = {
  render: () => (
    <div className="w-[300px] rounded-lg border bg-card p-4 shadow-md">
      <div className="space-y-1">
        <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
          Profile
        </button>
        <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
          Settings
        </button>
      </div>
      <Separator className="my-2" />
      <div className="space-y-1">
        <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
          Team
        </button>
        <button className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent">
          Billing
        </button>
      </div>
      <Separator className="my-2" />
      <button className="w-full rounded px-2 py-1.5 text-left text-sm text-destructive hover:bg-accent">
        Sign out
      </button>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
