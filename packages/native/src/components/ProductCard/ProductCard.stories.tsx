import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ProductCard } from '@tesserix/native'

const meta: Meta<typeof ProductCard> = {
  title: 'Native/DataDisplay/ProductCard',
  component: ProductCard,
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
type Story = StoryObj<typeof ProductCard>

export const Default: Story = {
  args: {},
}
