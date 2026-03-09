import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { RadioGroup, RadioGroupItem } from './radio'
import { Label } from '../label'

const meta = {
  title: 'Forms/Radio',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

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
            <RadioGroup defaultValue="free">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="free" value="free" />
                <Label htmlFor="free">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="pro" value="pro" />
                <Label htmlFor="pro">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="enterprise" value="enterprise" />
                <Label htmlFor="enterprise">Enterprise</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Notification Preferences</h3>
            <RadioGroup defaultValue="all">
              <div className="flex items-start space-x-2">
                <RadioGroupItem id="all" value="all" />
                <div>
                  <Label htmlFor="all">All notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive all updates and alerts
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem id="important" value="important" />
                <div>
                  <Label htmlFor="important">Important only</Label>
                  <p className="text-xs text-muted-foreground">
                    Only critical notifications
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem id="none" value="none" />
                <div>
                  <Label htmlFor="none">None</Label>
                  <p className="text-xs text-muted-foreground">
                    Disable all notifications
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground">Disabled State</h3>
            <RadioGroup disabled>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="disabled-option" value="disabled" />
                <Label htmlFor="disabled-option">Disabled option</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <RadioGroup defaultValue="option">
      <div className="flex items-center space-x-2">
        <RadioGroupItem id="option" value="option" />
        <Label htmlFor="option">Option 1</Label>
      </div>
    </RadioGroup>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
