import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { TimePicker } from '@tesserix/native'

const meta: Meta<typeof TimePicker> = {
  title: 'Native/TimePicker',
  component: TimePicker,
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
type Story = StoryObj<typeof TimePicker>

export const Default: Story = {
  args: {},
}
