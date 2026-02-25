import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ColorPicker } from '@tesserix/native'

const meta: Meta<typeof ColorPicker> = {
  title: 'Native/Forms/ColorPicker',
  component: ColorPicker,
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
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
  args: {},
}
