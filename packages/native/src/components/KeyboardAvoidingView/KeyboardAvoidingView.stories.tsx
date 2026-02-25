import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { KeyboardAvoidingView } from '@tesserix/native'

const meta: Meta<typeof KeyboardAvoidingView> = {
  title: 'Native/Layout/KeyboardAvoidingView',
  component: KeyboardAvoidingView,
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
type Story = StoryObj<typeof KeyboardAvoidingView>

export const Default: Story = {
  args: {},
}
