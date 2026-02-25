import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { SafeAreaView } from '@tesserix/native'

const meta: Meta<typeof SafeAreaView> = {
  title: 'Native/SafeAreaView',
  component: SafeAreaView,
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
type Story = StoryObj<typeof SafeAreaView>

export const Default: Story = {
  args: {},
}
