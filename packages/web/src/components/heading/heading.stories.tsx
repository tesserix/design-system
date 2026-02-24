import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Heading } from './heading'

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'The size/level of the heading',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'h1' },
      },
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'The HTML element to render',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the heading',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the heading',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Heading',
  },
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Text Hierarchy</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Heading Showcase</h2>
          <p className="text-sm text-muted-foreground">Semantic heading elements for content structure.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Heading size="h1">Heading 1</Heading>
            <Heading size="h2">Heading 2</Heading>
            <Heading size="h3">Heading 3</Heading>
            <Heading size="h4">Heading 4</Heading>
            <Heading size="h5">Heading 5</Heading>
            <Heading size="h6">Heading 6</Heading>
          </div>

          <div className="rounded-lg border bg-muted/50 p-6">
            <Heading size="h3" className="mb-4">
              Typography Scale
            </Heading>
            <p className="text-sm text-muted-foreground mb-4">
              All headings are responsive and adjust based on screen size.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>H1</span>
                <span className="text-muted-foreground">4xl / 5xl / 6xl</span>
              </div>
              <div className="flex items-center justify-between">
                <span>H2</span>
                <span className="text-muted-foreground">3xl / 4xl / 5xl</span>
              </div>
              <div className="flex items-center justify-between">
                <span>H3</span>
                <span className="text-muted-foreground">2xl / 3xl / 4xl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const H1: Story = {
  args: {
    size: 'h1',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const H2: Story = {
  args: {
    size: 'h2',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const H3: Story = {
  args: {
    size: 'h3',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const H4: Story = {
  args: {
    size: 'h4',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const H5: Story = {
  args: {
    size: 'h5',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const H6: Story = {
  args: {
    size: 'h6',
    children: 'The quick brown fox jumps over the lazy dog',
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
