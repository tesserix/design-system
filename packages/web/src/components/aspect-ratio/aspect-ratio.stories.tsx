import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { AspectRatio } from './aspect-ratio'

const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: 'number',
      description: 'The aspect ratio (width / height)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
  },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Container</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">AspectRatio Showcase</h2>
          <p className="text-sm text-muted-foreground">Maintain consistent aspect ratios for media content.</p>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">16:9 (Video)</h3>
            <div className="w-full max-w-md">
              <AspectRatio ratio={16 / 9}>
                <img
                  src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                  alt="Photo by Drew Beamer"
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">1:1 (Square)</h3>
            <div className="w-full max-w-xs">
              <AspectRatio ratio={1}>
                <img
                  src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
                  alt="Photo by Yash Patel"
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">4:3 (Classic)</h3>
            <div className="w-full max-w-md">
              <AspectRatio ratio={4 / 3}>
                <img
                  src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&dpr=2&q=80"
                  alt="Photo by Riccardo Annandale"
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-4 text-sm font-semibold">21:9 (Ultrawide)</h3>
            <div className="w-full">
              <AspectRatio ratio={21 / 9}>
                <img
                  src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1200&dpr=2&q=80"
                  alt="Photo by Mick Haupt"
                  className="h-full w-full rounded-md object-cover"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Video: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[450px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Photo by Yash Patel"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
  },
  render: (args) => (
    <div className="w-[300px]">
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&dpr=2&q=80"
          alt="Photo by Riccardo Annandale"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
