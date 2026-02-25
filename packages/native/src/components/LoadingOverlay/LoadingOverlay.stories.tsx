import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { LoadingOverlay } from '@tesserix/native'

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Native/LoadingOverlay',
  component: LoadingOverlay,
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
type Story = StoryObj<typeof LoadingOverlay>

export const Default: Story = {
  args: {},
}
