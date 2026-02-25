import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Spotlight } from '@tesserix/native'

const meta: Meta<typeof Spotlight> = {
  title: 'Native/Overlays/Spotlight',
  component: Spotlight,
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
type Story = StoryObj<typeof Spotlight>

export const Default: Story = {
  args: {},
}
