import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Stepper } from '@tesserix/native'

const meta: Meta<typeof Stepper> = {
  title: 'Native/Navigation/Stepper',
  component: Stepper,
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
type Story = StoryObj<typeof Stepper>

export const Default: Story = {
  args: {},
}
