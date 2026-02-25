import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { FormControl } from '@tesserix/native'

const meta: Meta<typeof FormControl> = {
  title: 'Native/Forms/FormControl',
  component: FormControl,
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
type Story = StoryObj<typeof FormControl>

export const Default: Story = {
  args: {},
}
