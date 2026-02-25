import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { FAB } from '@tesserix/native'

const meta: Meta<typeof FAB> = {
  title: 'Native/FAB',
  component: FAB,
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
type Story = StoryObj<typeof FAB>

export const Default: Story = {
  args: {},
}
