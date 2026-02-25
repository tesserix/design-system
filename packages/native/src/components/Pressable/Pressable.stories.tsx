import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Pressable } from '@tesserix/native'

const meta: Meta<typeof Pressable> = {
  title: 'Native/Navigation/Pressable',
  component: Pressable,
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
type Story = StoryObj<typeof Pressable>

export const Default: Story = {
  args: {},
}
