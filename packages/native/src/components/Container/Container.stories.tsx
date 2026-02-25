import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Container } from '@tesserix/native'

const meta: Meta<typeof Container> = {
  title: 'Native/Container',
  component: Container,
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
type Story = StoryObj<typeof Container>

export const Default: Story = {
  args: {},
}
