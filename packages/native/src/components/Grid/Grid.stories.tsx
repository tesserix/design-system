import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Grid } from '@tesserix/native'

const meta: Meta<typeof Grid> = {
  title: 'Native/Grid',
  component: Grid,
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
type Story = StoryObj<typeof Grid>

export const Default: Story = {
  args: {},
}
