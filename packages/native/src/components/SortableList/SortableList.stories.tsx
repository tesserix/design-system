import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { SortableList } from '@tesserix/native'

const meta: Meta<typeof SortableList> = {
  title: 'Native/Utilities/SortableList',
  component: SortableList,
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
type Story = StoryObj<typeof SortableList>

export const Default: Story = {
  args: {},
}
