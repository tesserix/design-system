import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Accordion } from '@tesserix/native'

const meta: Meta<typeof Accordion> = {
  title: 'Native/Components/Accordion',
  component: Accordion,
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
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  args: {},
}
