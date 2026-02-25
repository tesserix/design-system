import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ReviewCard } from '@tesserix/native'

const meta: Meta<typeof ReviewCard> = {
  title: 'Native/DataDisplay/ReviewCard',
  component: ReviewCard,
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
type Story = StoryObj<typeof ReviewCard>

export const Default: Story = {
  args: {},
}
