import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Chip } from '@tesserix/native'

const meta: Meta<typeof Chip> = {
  title: 'Native/Chip',
  component: Chip,
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
type Story = StoryObj<typeof Chip>

export const Default: Story = {
  args: {},
}
