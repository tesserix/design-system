import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { AudioPlayer } from '@tesserix/native'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Native/AudioPlayer',
  component: AudioPlayer,
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
type Story = StoryObj<typeof AudioPlayer>

export const Default: Story = {
  args: {},
}
