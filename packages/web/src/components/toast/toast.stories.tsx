import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { Button } from "../button"
import { ToastProvider, ToastViewport, useToast } from "./toast"

const ToastDemo = () => {
  const { toast } = useToast()

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        onClick={() =>
          toast({
            title: "Profile updated",
            description: "Your account settings were saved successfully.",
            variant: "success",
          })
        }
      >
        Success Toast
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Connection unstable",
            description: "Network latency is higher than expected.",
            variant: "warning",
          })
        }
      >
        Warning Toast
      </Button>
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            title: "Action failed",
            description: "Unable to save changes. Try again in a few moments.",
            variant: "destructive",
          })
        }
      >
        Error Toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast({
            title: "New deployment ready",
            description: "A new release is available for production.",
            variant: "info",
            actionLabel: "View",
          })
        }
      >
        Action Toast
      </Button>
    </div>
  )
}

const meta = {
  title: "Feedback/Toast",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Toast supports transient status messaging, optional actions, configurable duration, and viewport positioning.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const ActionToastDemo = () => {
  const { toast } = useToast()
  const [actionState, setActionState] = React.useState("none")

  return (
    <div className="space-y-3">
      <Button
        onClick={() =>
          toast({
            title: "Deployment available",
            description: "Review release notes before rollout.",
            variant: "info",
            actionLabel: "View",
            onAction: () => setActionState("view"),
          })
        }
      >
        Open Action Toast
      </Button>
      <p className="text-sm text-muted-foreground">Action clicked: {actionState}</p>
    </div>
  )
}

const ToastControlDemo = () => {
  const { toast, dismiss, clear } = useToast()
  const [lastId, setLastId] = React.useState("")

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline"
        onClick={() => {
          const id = toast({
            title: "Auto close",
            description: "This should disappear quickly.",
            duration: 20,
          })
          setLastId(id)
        }}
      >
        Short Duration Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const id = toast({
            title: "Manual close only",
            description: "Duration disabled.",
            duration: 0,
          })
          setLastId(id)
        }}
      >
        No Auto Dismiss Toast
      </Button>
      <Button variant="outline" onClick={() => dismiss(lastId)} disabled={!lastId}>
        Dismiss Last
      </Button>
      <Button variant="outline" onClick={clear}>
        Clear All
      </Button>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Feedback</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Toast Showcase</h2>
          <p className="text-sm text-muted-foreground">Non-blocking notifications for status and actions.</p>
        </div>

        <ToastProvider>
          <ToastDemo />
          <ToastViewport />
        </ToastProvider>
      </div>
    </div>
  ),
}

export const Simple: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
      <ToastViewport />
    </ToastProvider>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /success toast/i })
    fireEvent.click(trigger)

    const status = await waitFor(() => within(document.body).getByRole("status"))
    await waitFor(() => {
      expect(status).toHaveTextContent(/profile updated/i)
    })

    const closeButton = within(status).getByRole("button", { name: /close notification/i })
    fireEvent.click(closeButton)
    await waitFor(() => {
      expect(within(document.body).queryByRole("status")).not.toBeInTheDocument()
    })
  },
}

export const ActionCallback: Story = {
  render: () => (
    <ToastProvider>
      <ActionToastDemo />
      <ToastViewport />
    </ToastProvider>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: /open action toast/i })
    fireEvent.click(trigger)

    const status = await waitFor(() => within(document.body).getByRole("status"))
    const actionButton = within(status).getByRole("button", { name: /view/i })
    fireEvent.click(actionButton)

    await waitFor(() => {
      expect(canvas.getByText(/action clicked: view/i)).toBeInTheDocument()
      expect(within(document.body).queryByRole("status")).not.toBeInTheDocument()
    })
  },
}

export const DurationAndControls: Story = {
  render: () => (
    <ToastProvider>
      <ToastControlDemo />
      <ToastViewport />
    </ToastProvider>
  ),
  play: async ({ canvas }) => {
    fireEvent.click(canvas.getByRole("button", { name: /short duration toast/i }))
    await waitFor(() => {
      expect(within(document.body).getByRole("status")).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(within(document.body).queryByRole("status")).not.toBeInTheDocument()
    })

    fireEvent.click(canvas.getByRole("button", { name: /no auto dismiss toast/i }))
    await waitFor(() => {
      expect(within(document.body).getByRole("status")).toBeInTheDocument()
    })
    fireEvent.click(canvas.getByRole("button", { name: /dismiss last/i }))
    await waitFor(() => {
      expect(within(document.body).queryByRole("status")).not.toBeInTheDocument()
    })

    fireEvent.click(canvas.getByRole("button", { name: /no auto dismiss toast/i }))
    await waitFor(() => {
      expect(within(document.body).getByRole("status")).toBeInTheDocument()
    })
    fireEvent.click(canvas.getByRole("button", { name: /clear all/i }))
    await waitFor(() => {
      expect(within(document.body).queryByRole("status")).not.toBeInTheDocument()
    })
  },
}

export const TopLeftViewport: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
      <ToastViewport position="top-left" />
    </ToastProvider>
  ),
  play: async ({ canvas }) => {
    fireEvent.click(canvas.getByRole("button", { name: /warning toast/i }))
    await waitFor(() => {
      expect(within(document.body).getByRole("status")).toBeInTheDocument()
    })
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[820px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Actions + Variants</p>
        <ToastProvider>
          <ToastDemo />
          <ToastViewport />
        </ToastProvider>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Durations + Controls</p>
        <ToastProvider>
          <ToastControlDemo />
          <ToastViewport position="top-left" />
        </ToastProvider>
      </div>
    </div>
  ),
}
