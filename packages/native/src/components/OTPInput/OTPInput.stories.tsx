import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { OTPInput } from '@tesserix/native'

const meta: Meta<typeof OTPInput> = {
  title: 'Native/OTPInput',
  component: OTPInput,
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
type Story = StoryObj<typeof OTPInput>

export const Default: Story = {
  args: {},
}
