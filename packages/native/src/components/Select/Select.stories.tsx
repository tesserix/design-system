import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Select } from '@tesserix/native'

const meta: Meta<typeof Select> = {
  title: 'Native/Forms/Select',
  component: Select,
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
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {},
}
