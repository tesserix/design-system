import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Avatar } from '@tesserix/native'

const meta: Meta<typeof Avatar> = {
  title: 'Native/Avatar',
  component: Avatar,
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
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {},
}
