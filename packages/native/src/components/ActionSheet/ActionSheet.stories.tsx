import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ActionSheet } from '@tesserix/native'

const meta: Meta<typeof ActionSheet> = {
  title: 'Native/ActionSheet',
  component: ActionSheet,
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
type Story = StoryObj<typeof ActionSheet>

export const Default: Story = {
  args: {},
}
