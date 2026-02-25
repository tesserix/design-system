import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { FileUpload } from '@tesserix/native'

const meta: Meta<typeof FileUpload> = {
  title: 'Native/Forms/FileUpload',
  component: FileUpload,
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
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {},
}
