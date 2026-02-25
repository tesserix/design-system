import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Test } from '@tesserix/native'

const meta: Meta<typeof Test> = {
  title: 'Native/_Test',
  component: Test,
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
type Story = StoryObj<typeof Test>

export const Default: Story = {
  args: {
    text: 'This is a test component',
  },
}
