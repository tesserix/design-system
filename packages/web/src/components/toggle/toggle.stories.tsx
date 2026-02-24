import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, fn, waitFor } from 'storybook/test'
import { Toggle } from './toggle'

const meta = {
  title: 'Forms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
      description: 'The visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
      description: 'The size of the toggle',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    pressed: {
      control: 'boolean',
      description: 'Controlled pressed state',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Toggle Buttons</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Toggle Showcase</h2>
          <p className="text-sm text-muted-foreground">Two-state buttons for on/off actions.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Variants</h3>
            <div className="flex gap-2">
              <Toggle>Default</Toggle>
              <Toggle variant="outline">Outline</Toggle>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Sizes</h3>
            <div className="flex items-center gap-2">
              <Toggle size="sm">Small</Toggle>
              <Toggle size="default">Default</Toggle>
              <Toggle size="lg">Large</Toggle>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Formatting Toolbar</h3>
            <div className="flex gap-1">
              <Toggle>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8"/></svg>
              </Toggle>
              <Toggle>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
              </Toggle>
              <Toggle>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/></svg>
              </Toggle>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Basic: Story = {
  args: {
    children: 'Toggle',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Toggle',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Toggle',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Toggle',
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const Interaction: Story = {
  render: () => {
    const Demo = () => {
      const [count, setCount] = React.useState(0)
      return (
        <div className="space-y-2">
          <Toggle onPressedChange={() => setCount((current) => current + 1)}>Bold</Toggle>
          <p className="text-sm text-muted-foreground">Pressed change count: {count}</p>
        </div>
      )
    }
    return <Demo />
  },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: /bold/i })

    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(toggle)
    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-pressed', 'true')
      expect(canvas.getByText(/pressed change count: 1/i)).toBeInTheDocument()
    })
  },
}

export const ControlledPressed: Story = {
  render: () => {
    const Controlled = () => {
      const [pressed, setPressed] = React.useState(true)
      return (
        <div className="space-y-2">
          <Toggle pressed={pressed} onPressedChange={setPressed}>
            Pin
          </Toggle>
          <p className="text-sm text-muted-foreground">Pinned: {pressed ? 'yes' : 'no'}</p>
        </div>
      )
    }

    return <Controlled />
  },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: /pin/i })
    fireEvent.click(toggle)

    await waitFor(() => {
      expect(toggle).toHaveAttribute('aria-pressed', 'false')
      expect(canvas.getByText(/pinned: no/i)).toBeInTheDocument()
    })
  },
}

export const DisabledInteraction: Story = {
  args: {
    children: 'Disabled toggle',
    disabled: true,
    onPressedChange: fn(),
    onClick: fn(),
  },
  play: async ({ canvas, args }) => {
    const toggle = canvas.getByRole('button', { name: /disabled toggle/i })
    await expect(toggle).toBeDisabled()
    fireEvent.click(toggle)
    await expect(args.onPressedChange).not.toHaveBeenCalled()
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
