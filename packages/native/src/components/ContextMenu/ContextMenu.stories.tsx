import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ContextMenu } from '@tesserix/native'

const meta: Meta<typeof ContextMenu> = {
  title: 'Native/Overlays/ContextMenu',
  component: ContextMenu,
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
type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {
  args: {},
}
