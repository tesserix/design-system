import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Tabs } from '@tesserix/native'

const meta: Meta<typeof Tabs> = {
  title: 'Native/Tabs',
  component: Tabs,
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
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  args: {},
}
