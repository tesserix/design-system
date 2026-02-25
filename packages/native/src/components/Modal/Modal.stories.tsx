import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Modal } from '@tesserix/native'

const meta: Meta<typeof Modal> = {
  title: 'Native/Overlays/Modal',
  component: Modal,
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
type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: {},
}
