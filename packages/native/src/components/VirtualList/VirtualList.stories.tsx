import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { VirtualList } from '@tesserix/native'

const meta: Meta<typeof VirtualList> = {
  title: 'Native/VirtualList',
  component: VirtualList,
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
type Story = StoryObj<typeof VirtualList>

export const Default: Story = {
  args: {},
}
