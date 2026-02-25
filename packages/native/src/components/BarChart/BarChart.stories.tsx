import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { BarChart } from '@tesserix/native'

const meta: Meta<typeof BarChart> = {
  title: 'Native/BarChart',
  component: BarChart,
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
type Story = StoryObj<typeof BarChart>

export const Default: Story = {
  args: {},
}
