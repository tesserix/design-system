import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Divider } from '@tesserix/native'

const meta: Meta<typeof Divider> = {
  title: 'Native/Layout/Divider',
  component: Divider,
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
type Story = StoryObj<typeof Divider>

export const Default: Story = {
  args: {},
}
