import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { TabBar } from '@tesserix/native'

const meta: Meta<typeof TabBar> = {
  title: 'Native/TabBar',
  component: TabBar,
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
type Story = StoryObj<typeof TabBar>

export const Default: Story = {
  args: {},
}
