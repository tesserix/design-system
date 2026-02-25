import type { Meta, StoryObj } from '@storybook/react'
import { View, Text } from 'react-native'
import { Card } from '@tesserix/native'

const meta: Meta<typeof Card> = {
  title: 'Native/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled', 'unstyled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    elevation: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, minWidth: 320 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Card>

const SampleContent = () => (
  <View>
    <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Card Title</Text>
    <Text style={{ fontSize: 14, color: '#6b7280' }}>
      This is a sample card with some content. Cards are used to group related information together.
    </Text>
  </View>
)

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: <SampleContent />,
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: <SampleContent />,
  },
}

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: <SampleContent />,
  },
}

export const Unstyled: Story = {
  args: {
    variant: 'unstyled',
    children: <SampleContent />,
  },
}

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: <SampleContent />,
  },
}

export const MediumPadding: Story = {
  args: {
    padding: 'md',
    children: <SampleContent />,
  },
}

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: <SampleContent />,
  },
}

export const ExtraLargePadding: Story = {
  args: {
    padding: 'xl',
    children: <SampleContent />,
  },
}

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <View style={{ padding: 16 }}>
        <SampleContent />
      </View>
    ),
  },
}

export const SmallRounded: Story = {
  args: {
    rounded: 'sm',
    children: <SampleContent />,
  },
}

export const LargeRounded: Story = {
  args: {
    rounded: 'lg',
    children: <SampleContent />,
  },
}

export const FullRounded: Story = {
  args: {
    rounded: 'full',
    padding: 'lg',
    children: <SampleContent />,
  },
}

export const NoElevation: Story = {
  args: {
    elevation: 'none',
    children: <SampleContent />,
  },
}

export const SmallElevation: Story = {
  args: {
    elevation: 'sm',
    children: <SampleContent />,
  },
}

export const LargeElevation: Story = {
  args: {
    elevation: 'lg',
    children: <SampleContent />,
  },
}

export const ExtraLargeElevation: Story = {
  args: {
    elevation: 'xl',
    children: <SampleContent />,
  },
}

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 16, width: '100%' }}>
      <Card variant="elevated">
        <Text style={{ fontWeight: '600' }}>Elevated Card</Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>Default elevated variant</Text>
      </Card>
      <Card variant="outlined">
        <Text style={{ fontWeight: '600' }}>Outlined Card</Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>With border outline</Text>
      </Card>
      <Card variant="filled">
        <Text style={{ fontWeight: '600' }}>Filled Card</Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>Filled background</Text>
      </Card>
      <Card variant="unstyled">
        <Text style={{ fontWeight: '600' }}>Unstyled Card</Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>No default styling</Text>
      </Card>
    </View>
  ),
}

export const AllPaddings: Story = {
  render: () => (
    <View style={{ gap: 16, width: '100%' }}>
      <Card padding="sm">
        <Text>Small Padding</Text>
      </Card>
      <Card padding="md">
        <Text>Medium Padding (Default)</Text>
      </Card>
      <Card padding="lg">
        <Text>Large Padding</Text>
      </Card>
      <Card padding="xl">
        <Text>Extra Large Padding</Text>
      </Card>
    </View>
  ),
}

export const AllElevations: Story = {
  render: () => (
    <View style={{ gap: 16, width: '100%' }}>
      <Card elevation="none">
        <Text style={{ fontWeight: '600' }}>No Elevation</Text>
      </Card>
      <Card elevation="sm">
        <Text style={{ fontWeight: '600' }}>Small Elevation</Text>
      </Card>
      <Card elevation="md">
        <Text style={{ fontWeight: '600' }}>Medium Elevation</Text>
      </Card>
      <Card elevation="lg">
        <Text style={{ fontWeight: '600' }}>Large Elevation</Text>
      </Card>
      <Card elevation="xl">
        <Text style={{ fontWeight: '600' }}>Extra Large Elevation</Text>
      </Card>
    </View>
  ),
}
