import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Heading } from '@tesserix/native'

const meta: Meta<typeof Heading> = {
  title: 'Native/Typography/Heading',
  component: Heading,
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
type Story = StoryObj<typeof Heading>

export const Default: Story = {
  args: {},
}
