import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Tooltip } from '@tesserix/native'

const meta: Meta<typeof Tooltip> = {
  title: 'Native/Overlays/Tooltip',
  component: Tooltip,
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
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {},
}
