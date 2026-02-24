import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { Button } from '../button'

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the card',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      description: 'The content of the card (CardHeader, CardContent, CardFooter)',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="mb-2">
          <p className="text-sm font-medium text-primary">Surface System</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Card Layout Showcase</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
              <CardDescription>Revenue and retention at a glance with contextual actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-card-foreground">$48.2K</p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-card-foreground">12,480</p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="text-2xl font-bold text-card-foreground">6.4%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline">Export Report</Button>
              <Button>Open Dashboard</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent events from your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border bg-background p-3 text-sm">New design tokens synced</div>
                <div className="rounded-lg border bg-background p-3 text-sm">3 pull requests awaiting review</div>
                <div className="rounded-lg border bg-background p-3 text-sm">Team standup starts in 20 minutes</div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">View Timeline</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is a simple card with just a title and content.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">New message from John</p>
          <p className="text-sm">Meeting reminder at 3 PM</p>
          <p className="text-sm">Project update available</p>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Dismiss</Button>
        <Button>View All</Button>
      </CardFooter>
    </Card>
  ),
}

export const Glassmorphism: Story = {
  render: () => (
    <div
      className="relative min-h-[500px] rounded-2xl bg-gradient-to-br from-violet-500/30 via-pink-500/30 to-orange-500/30 p-12"
      style={{
        backgroundImage:
          'radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.4), transparent 50%)',
      }}
    >
      <div className="flex items-center justify-center">
        <Card variant="glass" className="w-[380px]">
          <CardHeader>
            <CardTitle>Glass Card</CardTitle>
            <CardDescription>Semi-transparent card with backdrop blur effect</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Glass morphism creates a frosted glass effect using backdrop-filter: blur(). Perfect for modern,
              premium UI designs.
            </p>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Cancel</Button>
            <Button variant="glass">Continue</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
