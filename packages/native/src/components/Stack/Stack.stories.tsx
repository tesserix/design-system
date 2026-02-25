import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Stack } from '@tesserix/native'

const meta: Meta<typeof Stack> = {
  title: 'Native/Stack',
  component: Stack,
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
type Story = StoryObj<typeof Stack>

export const Default: Story = {
  args: {},
}
