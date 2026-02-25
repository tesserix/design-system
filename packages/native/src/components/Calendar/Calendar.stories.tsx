import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Calendar } from '@tesserix/native'

const meta: Meta<typeof Calendar> = {
  title: 'Native/Calendar',
  component: Calendar,
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
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {},
}
