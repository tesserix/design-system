import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { LocationPicker } from '@tesserix/native'

const meta: Meta<typeof LocationPicker> = {
  title: 'Native/LocationPicker',
  component: LocationPicker,
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
type Story = StoryObj<typeof LocationPicker>

export const Default: Story = {
  args: {},
}
