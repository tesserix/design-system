import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Radio } from '@tesserix/native'

const meta: Meta<typeof Radio> = {
  title: 'Native/Forms/Radio',
  component: Radio,
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
type Story = StoryObj<typeof Radio>

export const Default: Story = {
  args: {},
}
