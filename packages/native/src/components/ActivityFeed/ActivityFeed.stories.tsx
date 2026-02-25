import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ActivityFeed } from '@tesserix/native'

const meta: Meta<typeof ActivityFeed> = {
  title: 'Native/DataDisplay/ActivityFeed',
  component: ActivityFeed,
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
type Story = StoryObj<typeof ActivityFeed>

export const Default: Story = {
  args: {},
}
