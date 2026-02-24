import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Progress } from './progress'

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'The current progress value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    max: {
      control: 'number',
      description: 'The maximum progress value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the progress bar',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 33,
  },
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Progress Indicators</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Progress Showcase</h2>
          <p className="text-sm text-muted-foreground">Visual indicators for task completion.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">File Upload</span>
              <span className="text-muted-foreground">33%</span>
            </div>
            <Progress value={33} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Processing</span>
              <span className="text-muted-foreground">66%</span>
            </div>
            <Progress value={66} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Completed</span>
              <span className="text-muted-foreground">100%</span>
            </div>
            <Progress value={100} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Not Started</span>
              <span className="text-muted-foreground">0%</span>
            </div>
            <Progress value={0} />
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">Project Progress</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Design</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <Progress value={100} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Development</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Testing</span>
                  <span className="text-muted-foreground">45%</span>
                </div>
                <Progress value={45} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Deployment</span>
                  <span className="text-muted-foreground">0%</span>
                </div>
                <Progress value={0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Empty: Story = {
  args: {
    value: 0,
  },
  render: (args) => <Progress {...args} className="w-[300px]" />,
}

export const OneThird: Story = {
  args: {
    value: 33,
  },
  render: (args) => <Progress {...args} className="w-[300px]" />,
}

export const Half: Story = {
  args: {
    value: 50,
  },
  render: (args) => <Progress {...args} className="w-[300px]" />,
}

export const TwoThirds: Story = {
  args: {
    value: 66,
  },
  render: (args) => <Progress {...args} className="w-[300px]" />,
}

export const Complete: Story = {
  args: {
    value: 100,
  },
  render: (args) => <Progress {...args} className="w-[300px]" />,
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
