import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { DashboardCard } from '@tesserix/native'

const meta: Meta<typeof DashboardCard> = {
  title: 'Native/DashboardCard',
  component: DashboardCard,
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
type Story = StoryObj<typeof DashboardCard>

export const Default: Story = {
  args: {},
}
