import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, waitFor } from 'storybook/test'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../card'

const meta = {
  title: 'Layout/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tabs supports controlled and uncontrolled selection with keyboard navigation (Arrow keys, Home/End) and accessible tab semantics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The controlled value of the active tab',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      control: 'text',
      description: 'The default active tab (uncontrolled)',
      table: {
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      action: 'valueChanged',
      description: 'Callback when the active tab changes',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Navigation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Tabs Showcase</h2>
          <p className="text-sm text-muted-foreground">Tabbed navigation for organizing content.</p>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Account Information</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings and preferences here.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="password" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Password Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password and security settings.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">General Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your application preferences.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Cards</h3>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      View a summary of your dashboard metrics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your overview content goes here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>
                      Detailed analytics and insights.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your analytics data goes here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>
                      Generate and view reports.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your reports go here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: /tab 1/i })
    const tab2 = canvas.getByRole('tab', { name: /tab 2/i })

    await expect(tab1).toHaveAttribute('aria-selected', 'true')
    tab1.focus()

    fireEvent.keyDown(tab1, { key: 'ArrowRight', code: 'ArrowRight' })
    await waitFor(() => {
      expect(tab2).toHaveAttribute('aria-selected', 'true')
    })
    await waitFor(() => {
      expect(canvas.getByRole('tabpanel')).toHaveTextContent(/content for tab 2/i)
    })
  },
}

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Billing (Locked)
        </TabsTrigger>
        <TabsTrigger value="tab3">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Overview content</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Billing content</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Settings content</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overview = canvas.getByRole('tab', { name: /overview/i })
    const locked = canvas.getByRole('tab', { name: /billing \(locked\)/i })

    await expect(overview).toHaveAttribute('aria-selected', 'true')
    await expect(locked).toBeDisabled()

    fireEvent.click(locked)
    await waitFor(() => {
      expect(overview).toHaveAttribute('aria-selected', 'true')
    })
  },
}

export const KeyboardNavigation: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-[420px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing (Locked)
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="text-sm">Overview content</p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="text-sm">Billing content</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm">Settings content</p>
      </TabsContent>
      <TabsContent value="security">
        <p className="text-sm">Security content</p>
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overview = canvas.getByRole('tab', { name: /overview/i })
    const settings = canvas.getByRole('tab', { name: /settings/i })
    const security = canvas.getByRole('tab', { name: /security/i })

    await expect(overview).toHaveAttribute('aria-selected', 'true')
    overview.focus()

    fireEvent.keyDown(overview, { key: 'ArrowRight' })
    await waitFor(() => {
      expect(settings).toHaveAttribute('aria-selected', 'true')
      expect(settings).toHaveFocus()
      expect(canvas.getByRole('tabpanel')).toHaveTextContent(/settings content/i)
    })

    fireEvent.keyDown(settings, { key: 'ArrowLeft' })
    await waitFor(() => {
      expect(overview).toHaveAttribute('aria-selected', 'true')
      expect(overview).toHaveFocus()
    })

    fireEvent.keyDown(overview, { key: 'End' })
    await waitFor(() => {
      expect(security).toHaveAttribute('aria-selected', 'true')
      expect(security).toHaveFocus()
    })

    fireEvent.keyDown(security, { key: 'Home' })
    await waitFor(() => {
      expect(overview).toHaveAttribute('aria-selected', 'true')
      expect(overview).toHaveFocus()
    })
  },
}

const ClickHandlerTabsDemo = () => {
  const [value, setValue] = React.useState('overview')
  const [clicks, setClicks] = React.useState(0)

  return (
    <div className="w-[420px] space-y-3">
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          <TabsTrigger
            value="overview"
            onClick={() => {
              setClicks((current) => current + 1)
            }}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <p className="text-sm">Overview content</p>
        </TabsContent>
        <TabsContent value="settings">
          <p className="text-sm">Settings content</p>
        </TabsContent>
      </Tabs>
      <p className="text-sm text-muted-foreground" data-testid="tab-state">
        Active: {value} | Clicks: {clicks}
      </p>
    </div>
  )
}

export const ControlledClickCallback: Story = {
  render: () => <ClickHandlerTabsDemo />,
  play: async ({ canvas }) => {
    const overview = canvas.getByRole('tab', { name: /overview/i })
    const settings = canvas.getByRole('tab', { name: /settings/i })

    fireEvent.click(settings)
    await waitFor(() => {
      expect(settings).toHaveAttribute('aria-selected', 'true')
      expect(canvas.getByRole('tabpanel')).toHaveTextContent(/settings content/i)
      expect(canvas.getByTestId('tab-state')).toHaveTextContent(/active:\s*settings/i)
    })

    fireEvent.click(overview)
    await waitFor(() => {
      expect(overview).toHaveAttribute('aria-selected', 'true')
      expect(canvas.getByTestId('tab-state')).toHaveTextContent(/clicks:\s*1/i)
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[860px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Default</p>
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Default tab content</TabsContent>
          <TabsContent value="two">Second tab content</TabsContent>
        </Tabs>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Disabled Option</p>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="locked" disabled>
              Locked
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview</TabsContent>
          <TabsContent value="locked">Locked</TabsContent>
          <TabsContent value="settings">Settings</TabsContent>
        </Tabs>
      </div>
    </div>
  ),
}
