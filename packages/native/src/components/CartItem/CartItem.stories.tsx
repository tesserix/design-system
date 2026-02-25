import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { CartItem } from '@tesserix/native'

const meta: Meta<typeof CartItem> = {
  title: 'Native/CartItem',
  component: CartItem,
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
type Story = StoryObj<typeof CartItem>

export const Default: Story = {
  args: {},
}
