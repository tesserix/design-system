import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { expect, fireEvent, waitFor } from 'storybook/test'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const meta = {
  title: 'Layout/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state',
      table: {
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Default open state (uncontrolled)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onOpenChange: {
      description: 'Callback when open state changes',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Interactive</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Collapsible Showcase</h2>
          <p className="text-sm text-muted-foreground">Expandable content sections.</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Basic</h3>
            <Collapsible className="space-y-2">
              <CollapsibleTrigger className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
                <div className="flex items-center justify-between">
                  <span>Can I use this component?</span>
                  <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  Yes! This component is built with accessibility in mind and follows best practices.
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Default Open</h3>
            <Collapsible defaultOpen className="space-y-2">
              <CollapsibleTrigger className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
                <div className="flex items-center justify-between">
                  <span>What are the features?</span>
                  <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                  <p>• Smooth animations</p>
                  <p>• Fully accessible</p>
                  <p>• Customizable styling</p>
                  <p>• Controlled and uncontrolled modes</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Multiple Items</h3>
            <div className="space-y-2">
              <Collapsible className="space-y-2">
                <CollapsibleTrigger className="rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
                  <div className="flex items-center justify-between">
                    <span>Section 1</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="rounded-md bg-background px-4 py-3 text-sm text-muted-foreground">
                    Content for section 1
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="space-y-2">
                <CollapsibleTrigger className="rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
                  <div className="flex items-center justify-between">
                    <span>Section 2</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="rounded-md bg-background px-4 py-3 text-sm text-muted-foreground">
                    Content for section 2
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="space-y-2">
                <CollapsibleTrigger className="rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
                  <div className="flex items-center justify-between">
                    <span>Section 3</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="rounded-md bg-background px-4 py-3 text-sm text-muted-foreground">
                    Content for section 3
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Simple: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Collapsible>
        <CollapsibleTrigger className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          <div className="flex items-center justify-between">
            <span>Show more</span>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            This is the collapsible content.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const WithList: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          <span>@peduarte starred 3 repositories</span>
          <ChevronDownIcon className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2 px-4">
            <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/primitives</div>
            <div className="rounded-md border px-4 py-2 text-sm">@radix-ui/colors</div>
            <div className="rounded-md border px-4 py-2 text-sm">@stitches/react</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const Interaction: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Collapsible>
        <CollapsibleTrigger className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
          Toggle section
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            Hidden details
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /toggle section/i })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(trigger)
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(canvas.getByText(/hidden details/i)).toBeInTheDocument()
    })

    fireEvent.click(trigger)
    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
  },
}

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false)
      return (
        <div className="w-[350px] space-y-2">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="rounded-md bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80">
              Controlled section
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
                Controlled details
              </div>
            </CollapsibleContent>
          </Collapsible>
          <p className="text-sm text-muted-foreground">Open: {open ? 'yes' : 'no'}</p>
        </div>
      )
    }
    return <Demo />
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /controlled section/i })
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(canvas.getByText(/open: yes/i)).toBeInTheDocument()
    })
  },
}
