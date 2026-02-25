import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { CopyToClipboard } from '@tesserix/native'

const meta: Meta<typeof CopyToClipboard> = {
  title: 'Native/Utilities/CopyToClipboard',
  component: CopyToClipboard,
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
type Story = StoryObj<typeof CopyToClipboard>

export const Default: Story = {
  args: {},
}
