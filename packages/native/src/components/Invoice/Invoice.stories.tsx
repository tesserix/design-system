import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Invoice } from '@tesserix/native'

const meta: Meta<typeof Invoice> = {
  title: 'Native/Invoice',
  component: Invoice,
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
type Story = StoryObj<typeof Invoice>

export const Default: Story = {
  args: {},
}
