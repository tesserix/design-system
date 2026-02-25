import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { MapView } from '@tesserix/native'

const meta: Meta<typeof MapView> = {
  title: 'Native/MapView',
  component: MapView,
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
type Story = StoryObj<typeof MapView>

export const Default: Story = {
  args: {},
}
