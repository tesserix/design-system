import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Link } from '@tesserix/native'

const meta: Meta<typeof Link> = {
  title: 'Native/Navigation/Link',
  component: Link,
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
type Story = StoryObj<typeof Link>

export const Default: Story = {
  args: {},
}
