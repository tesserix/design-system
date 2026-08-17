import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { CommandPalette } from "./command-palette"

const items = [
  { id: "new-project", label: "Create Project", group: "General" },
  { id: "open-settings", label: "Open Settings", group: "General" },
  { id: "invite-user", label: "Invite User", group: "Team" },
]

const meta = {
  title: "Patterns/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: () => {},
    items,
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    items,
  },
  render: (args) => <CommandPalette {...args} />,
}

export const Loading: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    items: [],
    loading: true,
  },
  render: (args) => <CommandPalette {...args} />,
}

/**
 * Results come from a server: the caller owns the query, matches it remotely,
 * and turns the internal filter off so a match the label does not literally
 * contain is still shown.
 */
export const ServerDrivenSearch: Story = {
  render: function ServerDrivenSearchStory(args) {
    const [query, setQuery] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [results, setResults] = React.useState<typeof items>([])

    React.useEffect(() => {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      const timer = setTimeout(() => {
        setResults([
          { id: "ticket-3184", label: `Ticket #3184 matching “${query}”`, group: "Tickets" },
          { id: "tenant-acme", label: `Tenant acme matching “${query}”`, group: "Tenants" },
        ])
        setLoading(false)
      }, 400)

      return () => clearTimeout(timer)
    }, [query])

    return (
      <CommandPalette
        {...args}
        items={results}
        query={query}
        onQueryChange={setQuery}
        loading={loading}
        shouldFilter={false}
        placeholder="Search tickets and tenants…"
        emptyText="Type to search."
      />
    )
  },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()

    // CommandDialog portals its content out of the story canvas, so queries
    // have to be scoped to the document rather than to canvasElement.
    const body = within(document.body)
    const input = body.getByPlaceholderText(/search commands/i)
    fireEvent.keyDown(input, { key: "ArrowDown" })

    // A real browser does not flush React's state update synchronously the way
    // jsdom's act()-wrapped fireEvent does, so the highlight has to be awaited.
    await waitFor(() =>
      expect(body.getByRole("option", { name: /create project/i })).toHaveAttribute("data-active", "true")
    )
  },
}
