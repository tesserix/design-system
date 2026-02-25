import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { VideoPlayer } from '@tesserix/native'

const meta: Meta<typeof VideoPlayer> = {
  title: 'Native/VideoPlayer',
  component: VideoPlayer,
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
type Story = StoryObj<typeof VideoPlayer>

export const Default: Story = {
  args: {},
}
