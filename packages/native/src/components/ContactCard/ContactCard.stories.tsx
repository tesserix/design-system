import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ContactCard } from '@tesserix/native'

const meta: Meta<typeof ContactCard> = {
  title: 'Native/DataDisplay/ContactCard',
  component: ContactCard,
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
type Story = StoryObj<typeof ContactCard>

export const Default: Story = {
  args: {},
}
