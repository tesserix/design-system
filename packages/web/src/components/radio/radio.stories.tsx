import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Radio } from './radio'
import { Label } from '../label'

const meta = {
  title: 'Forms/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the radio is checked',
      table: {
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      control: 'text',
      description: 'The name attribute for the radio group',
      table: {
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      description: 'The value of the radio button',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the radio',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Single Choice</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Radio Showcase</h2>
          <p className="text-sm text-muted-foreground">Mutually exclusive selection options.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground">Choose a plan</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Radio id="free" name="plan" value="free" defaultChecked />
                <Label htmlFor="free">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Radio id="pro" name="plan" value="pro" />
                <Label htmlFor="pro">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Radio id="enterprise" name="plan" value="enterprise" />
                <Label htmlFor="enterprise">Enterprise</Label>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Radio id="all" name="notifications" value="all" defaultChecked />
                <div>
                  <Label htmlFor="all">All notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive all updates and alerts
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Radio id="important" name="notifications" value="important" />
                <div>
                  <Label htmlFor="important">Important only</Label>
                  <p className="text-xs text-muted-foreground">
                    Only critical notifications
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Radio id="none" name="notifications" value="none" />
                <div>
                  <Label htmlFor="none">None</Label>
                  <p className="text-xs text-muted-foreground">
                    Disable all notifications
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground">Disabled State</h3>
            <div className="flex items-center space-x-2">
              <Radio id="disabled-option" name="disabled" disabled />
              <Label htmlFor="disabled-option">Disabled option</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Radio id="option" name="example" />
      <Label htmlFor="option">Option 1</Label>
    </div>
  ),
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
