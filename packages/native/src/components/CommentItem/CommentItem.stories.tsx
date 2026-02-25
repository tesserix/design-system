import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { CommentItem } from '@tesserix/native'

const meta: Meta<typeof CommentItem> = {
  title: 'Native/CommentItem',
  component: CommentItem,
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
type Story = StoryObj<typeof CommentItem>

export const Default: Story = {
  args: {},
}
