import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { UserCard } from '@tesserix/native'

const meta: Meta<typeof UserCard> = {
  title: 'Native/Components/UserCard',
  component: UserCard,
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
type Story = StoryObj<typeof UserCard>

export const Default: Story = {
  args: {},
}
