import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { LineChart } from '@tesserix/native'

const meta: Meta<typeof LineChart> = {
  title: 'Native/LineChart',
  component: LineChart,
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
type Story = StoryObj<typeof LineChart>

export const Default: Story = {
  args: {},
}
