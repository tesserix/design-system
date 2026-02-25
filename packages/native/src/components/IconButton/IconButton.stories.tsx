import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { IconButton } from '@tesserix/native'

const meta: Meta<typeof IconButton> = {
  title: 'Native/Components/IconButton',
  component: IconButton,
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
type Story = StoryObj<typeof IconButton>

export const Default: Story = {
  args: {},
}
