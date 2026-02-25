import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { MultiSelect } from '@tesserix/native'

const meta: Meta<typeof MultiSelect> = {
  title: 'Native/Forms/MultiSelect',
  component: MultiSelect,
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
type Story = StoryObj<typeof MultiSelect>

export const Default: Story = {
  args: {},
}
