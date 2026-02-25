import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Toast } from '@tesserix/native'

const meta: Meta<typeof Toast> = {
  title: 'Native/Feedback/Toast',
  component: Toast,
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
type Story = StoryObj<typeof Toast>

export const Default: Story = {
  args: {},
}
