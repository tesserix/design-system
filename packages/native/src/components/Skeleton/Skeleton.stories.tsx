import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Skeleton } from '@tesserix/native'

const meta: Meta<typeof Skeleton> = {
  title: 'Native/Skeleton',
  component: Skeleton,
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
type Story = StoryObj<typeof Skeleton>

export const Default: Story = {
  args: {},
}
