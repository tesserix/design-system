import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { KanbanBoard } from '@tesserix/native'

const meta: Meta<typeof KanbanBoard> = {
  title: 'Native/KanbanBoard',
  component: KanbanBoard,
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
type Story = StoryObj<typeof KanbanBoard>

export const Default: Story = {
  args: {},
}
