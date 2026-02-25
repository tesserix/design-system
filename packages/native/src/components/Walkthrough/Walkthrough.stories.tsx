import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Walkthrough } from '@tesserix/native'

const meta: Meta<typeof Walkthrough> = {
  title: 'Native/Overlays/Walkthrough',
  component: Walkthrough,
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
type Story = StoryObj<typeof Walkthrough>

export const Default: Story = {
  args: {},
}
