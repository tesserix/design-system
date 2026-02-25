import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { BottomSheet } from '@tesserix/native'

const meta: Meta<typeof BottomSheet> = {
  title: 'Native/BottomSheet',
  component: BottomSheet,
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
type Story = StoryObj<typeof BottomSheet>

export const Default: Story = {
  args: {},
}
