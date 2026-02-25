import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { DragAndDrop } from '@tesserix/native'

const meta: Meta<typeof DragAndDrop> = {
  title: 'Native/DragAndDrop',
  component: DragAndDrop,
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
type Story = StoryObj<typeof DragAndDrop>

export const Default: Story = {
  args: {},
}
