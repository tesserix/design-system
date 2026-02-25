import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { DataGrid } from '@tesserix/native'

const meta: Meta<typeof DataGrid> = {
  title: 'Native/DataGrid',
  component: DataGrid,
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
type Story = StoryObj<typeof DataGrid>

export const Default: Story = {
  args: {},
}
