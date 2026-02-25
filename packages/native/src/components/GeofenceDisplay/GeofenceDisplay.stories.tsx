import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { GeofenceDisplay } from '@tesserix/native'

const meta: Meta<typeof GeofenceDisplay> = {
  title: 'Native/Media/GeofenceDisplay',
  component: GeofenceDisplay,
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
type Story = StoryObj<typeof GeofenceDisplay>

export const Default: Story = {
  args: {},
}
