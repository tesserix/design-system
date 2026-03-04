import type { Meta, StoryObj } from '@storybook/react'
import { CountUp } from './count-up'

const meta = {
  title: 'Data Display/CountUp',
  component: CountUp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    end: {
      control: 'number',
      description: 'The target number to count up to',
    },
    duration: {
      control: 'number',
      description: 'Animation duration in seconds',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2' },
      },
    },
    prefix: {
      control: 'text',
      description: 'Text to prepend to the number',
    },
    suffix: {
      control: 'text',
      description: 'Text to append to the number',
    },
    decimals: {
      control: 'number',
      description: 'Number of decimal places',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
  },
} satisfies Meta<typeof CountUp>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    end: 1250,
    className: 'text-4xl font-bold',
  },
}

export const WithPrefix: Story = {
  args: {
    end: 9999,
    prefix: '$',
    className: 'text-4xl font-bold',
  },
}

export const WithSuffix: Story = {
  args: {
    end: 99.9,
    suffix: '%',
    decimals: 1,
    className: 'text-4xl font-bold',
  },
}
