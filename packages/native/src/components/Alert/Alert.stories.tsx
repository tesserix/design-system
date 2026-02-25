import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Alert } from '@tesserix/native'

const meta: Meta<typeof Alert> = {
  title: 'Native/Alert',
  component: Alert,
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
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  args: {},
}
