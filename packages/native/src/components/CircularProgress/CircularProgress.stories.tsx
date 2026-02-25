import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { CircularProgress } from '@tesserix/native'

const meta: Meta<typeof CircularProgress> = {
  title: 'Native/Feedback/CircularProgress',
  component: CircularProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CircularProgress>

export const Default: Story = {
  args: {},
}
