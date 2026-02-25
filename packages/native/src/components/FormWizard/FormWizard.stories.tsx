import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { FormWizard } from '@tesserix/native'

const meta: Meta<typeof FormWizard> = {
  title: 'Native/Forms/FormWizard',
  component: FormWizard,
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
type Story = StoryObj<typeof FormWizard>

export const Default: Story = {
  args: {},
}
