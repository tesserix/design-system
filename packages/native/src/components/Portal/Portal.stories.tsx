import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Portal } from '@tesserix/native'

const meta: Meta<typeof Portal> = {
  title: 'Native/Portal',
  component: Portal,
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
type Story = StoryObj<typeof Portal>

export const Default: Story = {
  args: {},
}
