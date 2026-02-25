import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ImageGallery } from '@tesserix/native'

const meta: Meta<typeof ImageGallery> = {
  title: 'Native/ImageGallery',
  component: ImageGallery,
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
type Story = StoryObj<typeof ImageGallery>

export const Default: Story = {
  args: {},
}
