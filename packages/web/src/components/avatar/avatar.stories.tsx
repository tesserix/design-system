import type { Meta, StoryObj } from '@storybook/react'
import { expect, fireEvent, waitFor } from 'storybook/test'
import { Avatar } from './avatar'

const meta = {
  title: 'Feedback/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Avatar supports image rendering with graceful fallback content for missing or failed image sources.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'The size of the avatar',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
    src: {
      control: 'text',
      description: 'The image source URL',
      table: {
        type: { summary: 'string' },
      },
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the image',
      table: {
        type: { summary: 'string' },
      },
    },
    fallback: {
      control: 'text',
      description: 'Fallback content when image fails to load',
      table: {
        type: { summary: 'string' },
      },
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the avatar',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">User Representation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Avatar Showcase</h2>
          <p className="text-sm text-muted-foreground">Profile images and user initials.</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Sizes</h3>
            <div className="flex items-center gap-4">
              <Avatar size="sm" fallback="SM" />
              <Avatar size="default" fallback="MD" />
              <Avatar size="lg" fallback="LG" />
              <Avatar size="xl" fallback="XL" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Initials</h3>
            <div className="flex items-center gap-4">
              <Avatar fallback="JD" />
              <Avatar fallback="AB" />
              <Avatar fallback="MK" />
              <Avatar fallback="SL" />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Images</h3>
            <div className="flex items-center gap-4">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                alt="User 1"
              />
              <Avatar
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                alt="User 2"
              />
              <Avatar
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                alt="User 3"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">User List</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar fallback="JD" />
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar fallback="AB" />
                <div>
                  <p className="text-sm font-medium">Alice Brown</p>
                  <p className="text-xs text-muted-foreground">alice.brown@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar fallback="MK" />
                <div>
                  <p className="text-sm font-medium">Mike Kim</p>
                  <p className="text-xs text-muted-foreground">mike.kim@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    alt: 'User avatar',
  },
}

export const WithFallback: Story = {
  args: {
    fallback: 'JD',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    fallback: 'SM',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    fallback: 'LG',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    fallback: 'XL',
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const ImageErrorFallback: Story = {
  render: () => (
    <Avatar
      src="https://invalid.local/avatar.png"
      alt="Broken avatar"
      fallback="ER"
    />
  ),
  play: async ({ canvas }) => {
    const image = canvas.getByRole('img', { name: /broken avatar/i })
    fireEvent.error(image)

    await waitFor(() => {
      expect(canvas.getByText('ER')).toBeInTheDocument()
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Validates runtime image-error handling and fallback rendering.',
      },
    },
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[560px] gap-4 md:grid-cols-3">
      <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">Image</p>
        <div className="flex justify-center">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
            alt="Loaded avatar"
          />
        </div>
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">Initials</p>
        <div className="flex justify-center">
          <Avatar fallback="JD" />
        </div>
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">No Content</p>
        <div className="flex justify-center">
          <Avatar />
        </div>
      </div>
    </div>
  ),
}
