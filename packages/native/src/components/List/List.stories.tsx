import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { List } from '@tesserix/native'

const meta: Meta<typeof List> = {
  title: 'Native/DataDisplay/List',
  component: List,
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
type Story = StoryObj<typeof List>

export const Default: Story = {
  args: {},
}
