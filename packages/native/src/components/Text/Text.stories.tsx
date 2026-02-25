import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Text } from '@tesserix/native'

const meta: Meta<typeof Text> = {
  title: 'Native/Text',
  component: Text,
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
type Story = StoryObj<typeof Text>

export const Default: Story = {
  args: {},
}
