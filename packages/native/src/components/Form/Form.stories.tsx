import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Form } from '@tesserix/native'

const meta: Meta<typeof Form> = {
  title: 'Native/Forms/Form',
  component: Form,
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
type Story = StoryObj<typeof Form>

export const Default: Story = {
  args: {},
}
