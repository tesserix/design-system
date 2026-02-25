import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { SegmentedControl } from '@tesserix/native'

const meta: Meta<typeof SegmentedControl> = {
  title: 'Native/SegmentedControl',
  component: SegmentedControl,
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
type Story = StoryObj<typeof SegmentedControl>

export const Default: Story = {
  args: {},
}
