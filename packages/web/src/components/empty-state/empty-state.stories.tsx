import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { Button } from "../button"
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from "./empty-state"

const EmptyStateDemo = () => {
  const [created, setCreated] = React.useState(false)

  if (created) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Project created successfully.</p>
      </div>
    )
  }

  return (
    <EmptyState>
      <EmptyStateIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M3.3 7 12 12l8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </EmptyStateIcon>
      <EmptyStateTitle>No projects yet</EmptyStateTitle>
      <EmptyStateDescription>
        Start by creating your first project. You can organize tasks, invite collaborators, and track progress.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button onClick={() => setCreated(true)}>Create Project</Button>
        <Button variant="outline">Import Data</Button>
      </EmptyStateActions>
    </EmptyState>
  )
}

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Feedback</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Empty State Showcase</h2>
          <p className="text-sm text-muted-foreground">Contextual guidance when there is no content to display.</p>
        </div>
        <EmptyStateDemo />
      </div>
    </div>
  ),
}

export const CreateAction: Story = {
  render: () => <EmptyStateDemo />,
  play: async ({ canvas }) => {
    const createButton = canvas.getByRole("button", { name: /create project/i })
    fireEvent.click(createButton)
    await waitFor(() => {
      expect(canvas.getByText(/project created successfully/i)).toBeInTheDocument()
    })
  },
}
