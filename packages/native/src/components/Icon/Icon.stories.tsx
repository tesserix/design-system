import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Icon } from '@tesserix/native'

const meta: Meta<typeof Icon> = {
  title: 'Native/Icon',
  component: Icon,
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
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {},
}
