import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { PricingCard } from '@tesserix/native'

const meta: Meta<typeof PricingCard> = {
  title: 'Native/DataDisplay/PricingCard',
  component: PricingCard,
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
type Story = StoryObj<typeof PricingCard>

export const Default: Story = {
  args: {},
}
