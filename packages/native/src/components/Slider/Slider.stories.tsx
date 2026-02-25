import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Slider } from '@tesserix/native'

const meta: Meta<typeof Slider> = {
  title: 'Native/Forms/Slider',
  component: Slider,
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
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: {},
}
