import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Switch } from '@tesserix/native'

const meta: Meta<typeof Switch> = {
  title: 'Native/Forms/Switch',
  component: Switch,
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
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: {},
}
