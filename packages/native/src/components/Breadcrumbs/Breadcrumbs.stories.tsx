import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Breadcrumbs } from '@tesserix/native'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Native/Breadcrumbs',
  component: Breadcrumbs,
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
type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
  args: {},
}
