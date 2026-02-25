import type { Meta, StoryObj } from '@storybook/react'
import { View, Text } from 'react-native'
import { Button } from '@tesserix/native'

const meta: Meta<typeof Button> = {
  title: 'Native/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'success'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, minWidth: 300 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    colorScheme: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    colorScheme: 'secondary',
  },
}

export const Error: Story = {
  args: {
    children: 'Error Button',
    colorScheme: 'error',
  },
}

export const Success: Story = {
  args: {
    children: 'Success Button',
    colorScheme: 'success',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
}

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 12, width: '100%' }}>
      <Button variant="solid" colorScheme="primary">
        Solid Primary
      </Button>
      <Button variant="outline" colorScheme="primary">
        Outline Primary
      </Button>
      <Button variant="ghost" colorScheme="primary">
        Ghost Primary
      </Button>
      <Button variant="solid" colorScheme="error">
        Solid Error
      </Button>
      <Button variant="outline" colorScheme="error">
        Outline Error
      </Button>
      <Button variant="solid" colorScheme="success">
        Solid Success
      </Button>
    </View>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </View>
  ),
}

export const States: Story = {
  render: () => (
    <View style={{ gap: 12, width: '100%' }}>
      <Button>Normal</Button>
      <Button isLoading>Loading</Button>
      <Button disabled>Disabled</Button>
    </View>
  ),
}
