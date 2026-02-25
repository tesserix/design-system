import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { SearchBar } from '@tesserix/native'

const meta: Meta<typeof SearchBar> = {
  title: 'Native/Forms/SearchBar',
  component: SearchBar,
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
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: {},
}
