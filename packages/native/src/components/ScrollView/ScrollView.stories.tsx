import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ScrollView } from '@tesserix/native'

const meta: Meta<typeof ScrollView> = {
  title: 'Native/ScrollView',
  component: ScrollView,
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
type Story = StoryObj<typeof ScrollView>

export const Default: Story = {
  args: {},
}
