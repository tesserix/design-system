import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { MetricCard } from '@tesserix/native'

const meta: Meta<typeof MetricCard> = {
  title: 'Native/MetricCard',
  component: MetricCard,
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
type Story = StoryObj<typeof MetricCard>

export const Default: Story = {
  args: {},
}
