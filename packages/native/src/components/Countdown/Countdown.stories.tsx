import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Countdown } from '@tesserix/native'

const meta: Meta<typeof Countdown> = {
  title: 'Native/Utilities/Countdown',
  component: Countdown,
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
type Story = StoryObj<typeof Countdown>

export const Default: Story = {
  args: {},
}
