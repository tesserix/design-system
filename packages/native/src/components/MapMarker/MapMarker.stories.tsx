import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { MapMarker } from '@tesserix/native'

const meta: Meta<typeof MapMarker> = {
  title: 'Native/Media/MapMarker',
  component: MapMarker,
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
type Story = StoryObj<typeof MapMarker>

export const Default: Story = {
  args: {},
}
