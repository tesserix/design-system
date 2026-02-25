import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Switch } from './switch'
import { Label } from '../label'

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is checked',
      table: {
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the switch',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Toggle Controls</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Switch Showcase</h2>
          <p className="text-sm text-muted-foreground">Toggle switches for on/off states.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Airplane Mode</Label>
                <p className="text-xs text-muted-foreground">Disable all wireless connections</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Location Services</Label>
                <p className="text-xs text-muted-foreground">Allow apps to access your location</p>
              </div>
              <Switch disabled />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">Privacy Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Analytics</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Personalized Ads</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label>Third-party Cookies</Label>
                <Switch defaultChecked />
              </div>
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
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    'aria-label': 'Checked switch',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled switch',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    'aria-label': 'Disabled and checked switch',
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
