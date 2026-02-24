import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning', 'info'],
      description: 'The visual style variant of the alert',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    children: {
      control: false,
      description: 'The content of the alert (AlertTitle, AlertDescription)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the alert',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="rounded-3xl border bg-card p-6 shadow-lg md:p-8">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-medium text-primary">Notifications</p>
            <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Alert Showcase</h2>
            <p className="text-sm text-muted-foreground">Important messages and notifications for users.</p>
          </div>

          <div className="space-y-4">
            <Alert>
              <AlertTitle>Default Alert</AlertTitle>
              <AlertDescription>
                This is a default alert that provides general information to the user.
              </AlertDescription>
            </Alert>

            <Alert variant="info">
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Your changes have been saved automatically. No action needed.
              </AlertDescription>
            </Alert>

            <Alert variant="success">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Your deployment was successful! The changes are now live.
              </AlertDescription>
            </Alert>

            <Alert variant="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Your subscription expires in 7 days. Please renew to avoid service interruption.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to process your request. Please try again or contact support.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Info: Story = {
  render: () => (
    <Alert variant="info" className="w-[500px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
}

export const Success: Story = {
  render: () => (
    <Alert variant="success" className="w-[500px]">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your payment has been processed successfully.
      </AlertDescription>
    </Alert>
  ),
}

export const Warning: Story = {
  render: () => (
    <Alert variant="warning" className="w-[500px]">
      <AlertTitle>Warning!</AlertTitle>
      <AlertDescription>
        This action cannot be undone. Please proceed with caution.
      </AlertDescription>
    </Alert>
  ),
}

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[500px]">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please sign in again.
      </AlertDescription>
    </Alert>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <Alert className="w-[500px]">
      <AlertDescription>
        This is a simple alert with just a description and no title.
      </AlertDescription>
    </Alert>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
