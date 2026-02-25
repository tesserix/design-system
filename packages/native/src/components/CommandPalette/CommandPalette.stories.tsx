import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { CommandPalette } from '@tesserix/native'

const meta: Meta<typeof CommandPalette> = {
  title: 'Native/Utilities/CommandPalette',
  component: CommandPalette,
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
type Story = StoryObj<typeof CommandPalette>

export const Default: Story = {
  args: {},
}
