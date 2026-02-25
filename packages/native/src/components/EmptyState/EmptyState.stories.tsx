import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { EmptyState } from '@tesserix/native'

const meta: Meta<typeof EmptyState> = {
  title: 'Native/Feedback/EmptyState',
  component: EmptyState,
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
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {},
}
