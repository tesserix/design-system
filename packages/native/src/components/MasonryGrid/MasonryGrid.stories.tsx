import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { MasonryGrid } from '@tesserix/native'

const meta: Meta<typeof MasonryGrid> = {
  title: 'Native/Media/MasonryGrid',
  component: MasonryGrid,
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
type Story = StoryObj<typeof MasonryGrid>

export const Default: Story = {
  args: {},
}
