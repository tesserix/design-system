import type { Meta, StoryObj } from '@storybook/react'
import { AnimateOnScroll, StaggerContainer, StaggerItem } from './animate-on-scroll'

const meta = {
  title: 'Animation/AnimateOnScroll',
  component: AnimateOnScroll,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['fade-up', 'fade-in', 'slide-left', 'slide-right', 'scale-in'],
      description: 'The animation variant to use',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'fade-up' },
      },
    },
    delay: {
      control: 'number',
      description: 'Delay before animation starts (seconds)',
    },
    duration: {
      control: 'number',
      description: 'Animation duration (seconds)',
    },
    as: {
      control: 'select',
      options: ['div', 'section'],
      description: 'The HTML element to render as',
    },
  },
} satisfies Meta<typeof AnimateOnScroll>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'fade-up',
    children: (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Animated Card</h3>
        <p className="text-muted-foreground mt-2">This card animates into view on scroll.</p>
      </div>
    ),
  },
  render: (args) => (
    <div className="min-h-screen bg-background p-8">
      <div className="h-[60vh] flex items-end justify-center">
        <p className="text-muted-foreground">Scroll down to see the animation</p>
      </div>
      <div className="max-w-md mx-auto">
        <AnimateOnScroll {...args} />
      </div>
    </div>
  ),
}

export const StaggeredList: Story = {
  args: {
    variant: 'fade-up',
    children: null,
  },
  render: () => (
    <div className="min-h-screen bg-background p-8">
      <div className="h-[60vh] flex items-end justify-center">
        <p className="text-muted-foreground">Scroll down to see the staggered animation</p>
      </div>
      <StaggerContainer className="max-w-md mx-auto space-y-4">
        {['First', 'Second', 'Third', 'Fourth'].map((label) => (
          <StaggerItem key={label}>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <p className="font-medium">{label} item</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  ),
}
