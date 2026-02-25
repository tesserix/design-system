import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Drawer } from '@tesserix/native'

const meta: Meta<typeof Drawer> = {
  title: 'Native/Drawer',
  component: Drawer,
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
type Story = StoryObj<typeof Drawer>

export const Default: Story = {
  args: {},
}
