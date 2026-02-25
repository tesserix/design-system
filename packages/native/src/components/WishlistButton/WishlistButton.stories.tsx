import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { WishlistButton } from '@tesserix/native'

const meta: Meta<typeof WishlistButton> = {
  title: 'Native/WishlistButton',
  component: WishlistButton,
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
type Story = StoryObj<typeof WishlistButton>

export const Default: Story = {
  args: {},
}
