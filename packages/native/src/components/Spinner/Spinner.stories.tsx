import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Spinner } from '@tesserix/native'

const meta: Meta<typeof Spinner> = {
  title: 'Native/Feedback/Spinner',
  component: Spinner,
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
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  args: {},
}
