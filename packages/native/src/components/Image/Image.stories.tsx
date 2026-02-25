import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Image } from '@tesserix/native'

const meta: Meta<typeof Image> = {
  title: 'Native/DataDisplay/Image',
  component: Image,
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
type Story = StoryObj<typeof Image>

export const Default: Story = {
  args: {},
}
