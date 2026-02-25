import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { TreeView } from '@tesserix/native'

const meta: Meta<typeof TreeView> = {
  title: 'Native/TreeView',
  component: TreeView,
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
type Story = StoryObj<typeof TreeView>

export const Default: Story = {
  args: {},
}
