import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Autocomplete } from '@tesserix/native'

const meta: Meta<typeof Autocomplete> = {
  title: 'Native/Autocomplete',
  component: Autocomplete,
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
type Story = StoryObj<typeof Autocomplete>

export const Default: Story = {
  args: {},
}
