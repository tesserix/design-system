import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { Button } from '../button'

const meta = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix-based Tooltip with hover and focus triggers and configurable placement.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Contextual Info</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Tooltip Showcase</h2>
          <p className="text-sm text-muted-foreground">Hover information for interactive elements.</p>
        </div>

        <TooltipProvider>
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-card-foreground">Positions</h3>
              <div className="flex flex-col items-center gap-8">
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="outline">Top</Button></TooltipTrigger>
                  <TooltipContent side="top">Tooltip on top</TooltipContent>
                </Tooltip>
                <div className="flex gap-8">
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="outline">Left</Button></TooltipTrigger>
                    <TooltipContent side="left">Tooltip on left</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="outline">Right</Button></TooltipTrigger>
                    <TooltipContent side="right">Tooltip on right</TooltipContent>
                  </Tooltip>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="outline">Bottom</Button></TooltipTrigger>
                  <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-6">
              <h3 className="mb-4 text-sm font-semibold">With Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Tooltip>
                  <TooltipTrigger asChild><Button>Save</Button></TooltipTrigger>
                  <TooltipContent>Save your changes</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="outline">Cancel</Button></TooltipTrigger>
                  <TooltipContent>Discard changes</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild><Button variant="destructive">Delete</Button></TooltipTrigger>
                  <TooltipContent side="bottom">This action cannot be undone</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
    </div>
  ),
}

export const Top: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>
        <TooltipContent side="top">This is a tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Bottom: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>
        <TooltipContent side="bottom">This is a tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Left: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>
        <TooltipContent side="left">This is a tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Right: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button>Hover me</Button></TooltipTrigger>
        <TooltipContent side="right">This is a tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const StateMatrix: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid w-[860px] gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Action Tooltips</p>
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild><Button>Save</Button></TooltipTrigger>
              <TooltipContent side="top">Save changes</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild><Button variant="outline">Cancel</Button></TooltipTrigger>
              <TooltipContent side="bottom">Discard changes</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Inline Hints</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help text-sm underline decoration-dotted">Command Palette</span>
            </TooltipTrigger>
            <TooltipContent side="right">Keyboard shortcut: Cmd+K</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
}
