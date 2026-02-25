import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Flex } from '@tesserix/native'

const meta: Meta<typeof Flex> = {
  title: 'Native/Flex',
  component: Flex,
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
type Story = StoryObj<typeof Flex>

export const Default: Story = {
  args: {},
}
