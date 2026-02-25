import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ChatBubble } from '@tesserix/native'

const meta: Meta<typeof ChatBubble> = {
  title: 'Native/ChatBubble',
  component: ChatBubble,
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
type Story = StoryObj<typeof ChatBubble>

export const Default: Story = {
  args: {},
}
