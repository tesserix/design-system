import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Rating } from '@tesserix/native'

const meta: Meta<typeof Rating> = {
  title: 'Native/Feedback/Rating',
  component: Rating,
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
type Story = StoryObj<typeof Rating>

export const Default: Story = {
  args: {},
}
