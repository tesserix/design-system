import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Popover } from '@tesserix/native'

const meta: Meta<typeof Popover> = {
  title: 'Native/Overlays/Popover',
  component: Popover,
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
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  args: {},
}
