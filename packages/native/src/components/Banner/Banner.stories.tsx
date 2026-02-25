import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Banner } from '@tesserix/native'

const meta: Meta<typeof Banner> = {
  title: 'Native/Feedback/Banner',
  component: Banner,
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
type Story = StoryObj<typeof Banner>

export const Default: Story = {
  args: {},
}
