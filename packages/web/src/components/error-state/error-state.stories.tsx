import type { Meta, StoryObj } from '@storybook/react'
import { fn } from 'storybook/test'
import { ErrorState } from './error-state'

const meta = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  args: {
    onRetry: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The error message to display',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Something went wrong' },
      },
    },
    onRetry: {
      description: 'Callback when the retry button is clicked',
    },
  },
} satisfies Meta<typeof ErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Something went wrong',
  },
}

export const CustomMessage: Story = {
  args: {
    message: 'Failed to load data. Please check your connection.',
  },
}

export const WithoutRetry: Story = {
  args: {
    message: 'This resource has been deleted.',
    onRetry: undefined,
  },
}
