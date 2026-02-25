import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Menu } from '@tesserix/native'

const meta: Meta<typeof Menu> = {
  title: 'Native/Menu',
  component: Menu,
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
type Story = StoryObj<typeof Menu>

export const Default: Story = {
  args: {},
}
