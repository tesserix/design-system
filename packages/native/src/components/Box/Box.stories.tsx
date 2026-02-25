import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Box } from '@tesserix/native'

const meta: Meta<typeof Box> = {
  title: 'Native/Box',
  component: Box,
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
type Story = StoryObj<typeof Box>

export const Default: Story = {
  args: {},
}
