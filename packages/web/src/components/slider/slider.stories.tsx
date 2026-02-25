import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Slider } from './slider'
import { Label } from '../label'

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    max: {
      control: 'number',
      description: 'Maximum value',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    step: {
      control: 'number',
      description: 'Step increment',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    defaultValue: {
      control: 'number',
      description: 'Default value',
      table: {
        type: { summary: 'number' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the slider is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Range Input</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Slider Showcase</h2>
          <p className="text-sm text-muted-foreground">Adjustable value sliders.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Volume</Label>
            <Slider defaultValue={50} />
          </div>

          <div className="space-y-2">
            <Label>Brightness</Label>
            <Slider defaultValue={75} />
          </div>

          <div className="space-y-2">
            <Label>Temperature (15-30°C)</Label>
            <Slider min={15} max={30} defaultValue={22} />
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">With Steps</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Steps of 10</Label>
                <Slider min={0} max={100} step={10} defaultValue={50} />
              </div>
              <div className="space-y-2">
                <Label>Steps of 25</Label>
                <Slider min={0} max={100} step={25} defaultValue={50} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Disabled</Label>
            <Slider defaultValue={50} disabled />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Basic: Story = {
  render: () => <Slider defaultValue={50} className="w-[300px]" aria-label="Basic slider" />,
}

export const WithSteps: Story = {
  render: () => <Slider min={0} max={100} step={10} defaultValue={30} className="w-[300px]" aria-label="Slider with steps of 10" />,
}

export const Disabled: Story = {
  render: () => <Slider defaultValue={50} disabled className="w-[300px]" aria-label="Disabled slider" />,
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
