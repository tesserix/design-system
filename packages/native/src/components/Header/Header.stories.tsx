import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Header } from '@tesserix/native'

const meta: Meta<typeof Header> = {
  title: 'Native/Utilities/Header',
  component: Header,
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
type Story = StoryObj<typeof Header>

export const Default: Story = {
  args: {},
}
