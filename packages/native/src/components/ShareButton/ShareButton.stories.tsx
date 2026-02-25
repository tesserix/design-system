import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ShareButton } from '@tesserix/native'

const meta: Meta<typeof ShareButton> = {
  title: 'Native/Utilities/ShareButton',
  component: ShareButton,
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
type Story = StoryObj<typeof ShareButton>

export const Default: Story = {
  args: {},
}
