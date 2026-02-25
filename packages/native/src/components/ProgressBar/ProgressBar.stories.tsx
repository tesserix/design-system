import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ProgressBar } from '@tesserix/native'

const meta: Meta<typeof ProgressBar> = {
  title: 'Native/Feedback/ProgressBar',
  component: ProgressBar,
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
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  args: {},
}
