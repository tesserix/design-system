import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Center } from '@tesserix/native'

const meta: Meta<typeof Center> = {
  title: 'Native/Layout/Center',
  component: Center,
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
type Story = StoryObj<typeof Center>

export const Default: Story = {
  args: {},
}
