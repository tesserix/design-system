import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from './avatar'

const meta = {
  title: 'Feedback/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Radix-based Avatar with image rendering and graceful fallback content.',
      },
    },
  },
  tags: ['autodocs'],
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
              <Avatar className="h-8 w-8">
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback>LG</AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16">
                <AvatarFallback>XL</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Initials</h3>
            <div className="flex items-center gap-4">
              <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>MK</AvatarFallback></Avatar>
              <Avatar><AvatarFallback>SL</AvatarFallback></Avatar>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">With Images</h3>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User 1" />
                <AvatarFallback>U1</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="User 2" />
                <AvatarFallback>U2</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="User 3" />
                <AvatarFallback>U3</AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 text-sm font-semibold">User List</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">Alice Brown</p>
                  <p className="text-xs text-muted-foreground">alice.brown@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>MK</AvatarFallback></Avatar>
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
  render: () => (
    <Avatar>
      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User avatar" />
      <AvatarFallback>UA</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
  ),
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[560px] gap-4 md:grid-cols-3">
      <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">Image</p>
        <div className="flex justify-center">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Loaded avatar" />
            <AvatarFallback>UA</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">Initials</p>
        <div className="flex justify-center">
          <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border bg-card p-4 text-center">
        <p className="text-xs font-medium text-muted-foreground">No Content</p>
        <div className="flex justify-center">
          <Avatar><AvatarFallback>?</AvatarFallback></Avatar>
        </div>
      </div>
    </div>
  ),
}
