import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Gauge } from '@tesserix/native'

const meta: Meta<typeof Gauge> = {
  title: 'Native/Utilities/Gauge',
  component: Gauge,
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
type Story = StoryObj<typeof Gauge>

export const Default: Story = {
  args: {},
}
