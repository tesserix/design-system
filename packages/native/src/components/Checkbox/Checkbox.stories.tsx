import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Checkbox } from '@tesserix/native'

const meta: Meta<typeof Checkbox> = {
  title: 'Native/Checkbox',
  component: Checkbox,
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
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {},
}
