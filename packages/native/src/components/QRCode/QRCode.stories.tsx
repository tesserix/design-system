import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { QRCode } from '@tesserix/native'

const meta: Meta<typeof QRCode> = {
  title: 'Native/Media/QRCode',
  component: QRCode,
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
type Story = StoryObj<typeof QRCode>

export const Default: Story = {
  args: {},
}
