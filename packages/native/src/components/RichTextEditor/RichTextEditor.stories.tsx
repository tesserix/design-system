import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { RichTextEditor } from '@tesserix/native'

const meta: Meta<typeof RichTextEditor> = {
  title: 'Native/Utilities/RichTextEditor',
  component: RichTextEditor,
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
type Story = StoryObj<typeof RichTextEditor>

export const Default: Story = {
  args: {},
}
