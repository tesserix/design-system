import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { SplitPane } from '@tesserix/native'

const meta: Meta<typeof SplitPane> = {
  title: 'Native/SplitPane',
  component: SplitPane,
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
type Story = StoryObj<typeof SplitPane>

export const Default: Story = {
  args: {},
}
