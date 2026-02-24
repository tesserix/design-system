import type { Meta, StoryObj } from '@storybook/react'
import { expect } from 'storybook/test'
import { Text } from './text'

const meta = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
      description: 'The size of the text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'base' },
      },
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'destructive'],
      description: 'The visual style variant of the text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'The font weight of the text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'normal' },
      },
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'label'],
      description: 'The HTML element to render',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'p' },
      },
    },
    children: {
      control: 'text',
      description: 'The content of the text',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

const sampleText = "The quick brown fox jumps over the lazy dog"

export const Default: Story = {
  args: {
    children: sampleText,
  },
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Body Text</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Text Showcase</h2>
          <p className="text-sm text-muted-foreground">Flexible text components with multiple variants.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Sizes</h3>
            <Text size="xs">{sampleText} (xs)</Text>
            <Text size="sm">{sampleText} (sm)</Text>
            <Text size="base">{sampleText} (base)</Text>
            <Text size="lg">{sampleText} (lg)</Text>
            <Text size="xl">{sampleText} (xl)</Text>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Variants</h3>
            <Text variant="default">{sampleText} (default)</Text>
            <Text variant="muted">{sampleText} (muted)</Text>
            <Text variant="primary">{sampleText} (primary)</Text>
            <Text variant="destructive">{sampleText} (destructive)</Text>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Weights</h3>
            <Text weight="normal">{sampleText} (normal)</Text>
            <Text weight="medium">{sampleText} (medium)</Text>
            <Text weight="semibold">{sampleText} (semibold)</Text>
            <Text weight="bold">{sampleText} (bold)</Text>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Example Paragraph</h3>
            <Text className="mb-3">
              This is a paragraph of text demonstrating how the Text component can be used for longer content.
              It flows naturally and wraps as needed based on the container width.
            </Text>
            <Text variant="muted" size="sm">
              This is secondary information in a smaller, muted style. Perfect for helper text or additional context.
            </Text>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: sampleText,
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: sampleText,
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: sampleText,
  },
}

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: sampleText,
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: sampleText,
  },
}

export const Bold: Story = {
  args: {
    weight: 'bold',
    children: sampleText,
  },
}

export const AsSpan: Story = {
  args: {
    as: 'span',
    children: sampleText,
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
