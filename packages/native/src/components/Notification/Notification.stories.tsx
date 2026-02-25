import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Notification } from '@tesserix/native'

const meta: Meta<typeof Notification> = {
  title: 'Native/Feedback/Notification',
  component: Notification,
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
type Story = StoryObj<typeof Notification>

export const Default: Story = {
  args: {},
}
