import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { Badge } from '@tesserix/native'

const meta: Meta<typeof Badge> = {
  title: 'Native/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['gray', 'red', 'green', 'blue', 'yellow', 'purple', 'pink', 'cyan'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    children: 'Badge',
  },
}

export const Gray: Story = {
  args: {
    children: 'Gray',
    colorScheme: 'gray',
  },
}

export const Red: Story = {
  args: {
    children: 'Error',
    colorScheme: 'red',
  },
}

export const Green: Story = {
  args: {
    children: 'Success',
    colorScheme: 'green',
  },
}

export const Blue: Story = {
  args: {
    children: 'Info',
    colorScheme: 'blue',
  },
}

export const Yellow: Story = {
  args: {
    children: 'Warning',
    colorScheme: 'yellow',
  },
}

export const Purple: Story = {
  args: {
    children: 'Purple',
    colorScheme: 'purple',
  },
}

export const Pink: Story = {
  args: {
    children: 'Pink',
    colorScheme: 'pink',
  },
}

export const Cyan: Story = {
  args: {
    children: 'Cyan',
    colorScheme: 'cyan',
  },
}

export const Solid: Story = {
  args: {
    children: 'Solid',
    variant: 'solid',
    colorScheme: 'blue',
  },
}

export const Subtle: Story = {
  args: {
    children: 'Subtle',
    variant: 'subtle',
    colorScheme: 'blue',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
    colorScheme: 'blue',
  },
}

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    children: 'Medium',
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
}

export const FullRounded: Story = {
  args: {
    children: '99+',
    rounded: 'full',
    colorScheme: 'red',
    variant: 'solid',
  },
}

export const AllColors: Story = {
  render: () => (
    <View style={{ gap: 8, flexDirection: 'row', flexWrap: 'wrap', maxWidth: 400 }}>
      <Badge colorScheme="gray">Gray</Badge>
      <Badge colorScheme="red">Red</Badge>
      <Badge colorScheme="green">Green</Badge>
      <Badge colorScheme="blue">Blue</Badge>
      <Badge colorScheme="yellow">Yellow</Badge>
      <Badge colorScheme="purple">Purple</Badge>
      <Badge colorScheme="pink">Pink</Badge>
      <Badge colorScheme="cyan">Cyan</Badge>
    </View>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Badge variant="subtle" colorScheme="blue">
        Subtle
      </Badge>
      <Badge variant="solid" colorScheme="blue">
        Solid
      </Badge>
      <Badge variant="outline" colorScheme="blue">
        Outline
      </Badge>
    </View>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <View style={{ gap: 8, alignItems: 'flex-start' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </View>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <View style={{ gap: 8, flexDirection: 'row', flexWrap: 'wrap', maxWidth: 400 }}>
      <Badge colorScheme="green" variant="solid">
        Active
      </Badge>
      <Badge colorScheme="yellow" variant="solid">
        Pending
      </Badge>
      <Badge colorScheme="red" variant="solid">
        Inactive
      </Badge>
      <Badge colorScheme="blue" variant="solid">
        New
      </Badge>
      <Badge colorScheme="purple" variant="solid">
        Premium
      </Badge>
    </View>
  ),
}

export const NotificationBadges: Story = {
  render: () => (
    <View style={{ gap: 12, alignItems: 'flex-start' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Badge size="sm" colorScheme="red" variant="solid" rounded="full">
          3
        </Badge>
        <Badge size="md" colorScheme="red" variant="solid" rounded="full">
          99+
        </Badge>
      </View>
    </View>
  ),
}

export const RoundedVariations: Story = {
  render: () => (
    <View style={{ gap: 8, alignItems: 'flex-start' }}>
      <Badge rounded="none">No Rounding</Badge>
      <Badge rounded="sm">Small</Badge>
      <Badge rounded="md">Medium</Badge>
      <Badge rounded="lg">Large</Badge>
      <Badge rounded="full">Full</Badge>
    </View>
  ),
}
