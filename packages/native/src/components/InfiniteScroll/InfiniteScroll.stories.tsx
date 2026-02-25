import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { InfiniteScroll } from '@tesserix/native'

const meta: Meta<typeof InfiniteScroll> = {
  title: 'Native/Media/InfiniteScroll',
  component: InfiniteScroll,
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
type Story = StoryObj<typeof InfiniteScroll>

export const Default: Story = {
  args: {},
}
