import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { TaskCard } from '@tesserix/native'

const meta: Meta<typeof TaskCard> = {
  title: 'Native/DataDisplay/TaskCard',
  component: TaskCard,
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
type Story = StoryObj<typeof TaskCard>

export const Default: Story = {
  args: {},
}
