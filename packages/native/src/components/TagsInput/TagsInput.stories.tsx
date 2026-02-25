import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { TagsInput } from '@tesserix/native'

const meta: Meta<typeof TagsInput> = {
  title: 'Native/TagsInput',
  component: TagsInput,
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
type Story = StoryObj<typeof TagsInput>

export const Default: Story = {
  args: {},
}
