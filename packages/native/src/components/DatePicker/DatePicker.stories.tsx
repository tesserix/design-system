import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { DatePicker } from '@tesserix/native'

const meta: Meta<typeof DatePicker> = {
  title: 'Native/Forms/DatePicker',
  component: DatePicker,
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
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  args: {},
}
