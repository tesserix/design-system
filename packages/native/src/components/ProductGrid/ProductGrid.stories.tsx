import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ProductGrid } from '@tesserix/native'

const meta: Meta<typeof ProductGrid> = {
  title: 'Native/ProductGrid',
  component: ProductGrid,
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
type Story = StoryObj<typeof ProductGrid>

export const Default: Story = {
  args: {},
}
