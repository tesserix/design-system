import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Swipeable } from '@tesserix/native'

const meta: Meta<typeof Swipeable> = {
  title: 'Native/Swipeable',
  component: Swipeable,
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
type Story = StoryObj<typeof Swipeable>

export const Default: Story = {
  args: {},
}
