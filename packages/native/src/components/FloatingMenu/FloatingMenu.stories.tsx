import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { FloatingMenu } from '@tesserix/native'

const meta: Meta<typeof FloatingMenu> = {
  title: 'Native/Utilities/FloatingMenu',
  component: FloatingMenu,
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
type Story = StoryObj<typeof FloatingMenu>

export const Default: Story = {
  args: {},
}
