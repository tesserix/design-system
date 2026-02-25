import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Textarea } from '@tesserix/native'

const meta: Meta<typeof Textarea> = {
  title: 'Native/Forms/Textarea',
  component: Textarea,
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
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {},
}
