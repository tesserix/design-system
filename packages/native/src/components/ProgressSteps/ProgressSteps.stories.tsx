import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ProgressSteps } from '@tesserix/native'

const meta: Meta<typeof ProgressSteps> = {
  title: 'Native/Feedback/ProgressSteps',
  component: ProgressSteps,
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
type Story = StoryObj<typeof ProgressSteps>

export const Default: Story = {
  args: {},
}
