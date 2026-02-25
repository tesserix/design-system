import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { BackButton } from '@tesserix/native'

const meta: Meta<typeof BackButton> = {
  title: 'Native/Navigation/BackButton',
  component: BackButton,
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
type Story = StoryObj<typeof BackButton>

export const Default: Story = {
  args: {},
}
