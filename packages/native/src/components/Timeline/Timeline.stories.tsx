import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Timeline } from '@tesserix/native'

const meta: Meta<typeof Timeline> = {
  title: 'Native/DataDisplay/Timeline',
  component: Timeline,
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
type Story = StoryObj<typeof Timeline>

export const Default: Story = {
  args: {},
}
