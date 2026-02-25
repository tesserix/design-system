import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { PullToRefresh } from '@tesserix/native'

const meta: Meta<typeof PullToRefresh> = {
  title: 'Native/PullToRefresh',
  component: PullToRefresh,
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
type Story = StoryObj<typeof PullToRefresh>

export const Default: Story = {
  args: {},
}
