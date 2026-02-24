import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Spinner } from './spinner'
import { Button } from '../button'

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'The size of the spinner',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'muted'],
      description: 'The visual style variant of the spinner',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the spinner',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-medium text-primary">Loading States</p>
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Spinner Showcase</h2>
            <p className="text-sm text-muted-foreground">Loading indicators for async operations.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">Sizes</h3>
                <div className="flex items-center gap-4">
                  <Spinner size="sm" />
                  <Spinner size="default" />
                  <Spinner size="lg" />
                  <Spinner size="xl" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">Variants</h3>
                <div className="flex items-center gap-4">
                  <Spinner variant="default" />
                  <Spinner variant="secondary" />
                  <Spinner variant="muted" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">In Buttons</h3>
                <div className="flex flex-col gap-2">
                  <Button disabled>
                    <Spinner size="sm" className="mr-2" />
                    Loading...
                  </Button>
                  <Button variant="outline" disabled>
                    <Spinner size="sm" className="mr-2" />
                    Please wait
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-card-foreground">Centered</h3>
                <div className="flex min-h-[100px] items-center justify-center rounded-lg border bg-muted/50">
                  <Spinner />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Muted: Story = {
  args: {
    variant: 'muted',
  },
}

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" className="mr-2" />
      Loading...
    </Button>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
