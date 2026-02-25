import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Carousel } from '@tesserix/native'

const meta: Meta<typeof Carousel> = {
  title: 'Native/Carousel',
  component: Carousel,
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
type Story = StoryObj<typeof Carousel>

export const Default: Story = {
  args: {},
}
