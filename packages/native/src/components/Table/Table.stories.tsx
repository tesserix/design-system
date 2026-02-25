import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Table } from '@tesserix/native'

const meta: Meta<typeof Table> = {
  title: 'Native/Table',
  component: Table,
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
type Story = StoryObj<typeof Table>

export const Default: Story = {
  args: {},
}
