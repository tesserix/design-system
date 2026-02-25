import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { OrderSummary } from '@tesserix/native'

const meta: Meta<typeof OrderSummary> = {
  title: 'Native/OrderSummary',
  component: OrderSummary,
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
type Story = StoryObj<typeof OrderSummary>

export const Default: Story = {
  args: {},
}
