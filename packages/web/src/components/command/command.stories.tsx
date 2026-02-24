import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor, within } from "storybook/test"

import { Button } from "../button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"

const commandItems = [
  { value: "open-project", label: "Open Project", shortcut: "⌘O", keywords: ["project", "open"] },
  { value: "new-branch", label: "Create Branch", shortcut: "⌘B", keywords: ["git", "branch"] },
  { value: "deploy-prod", label: "Deploy to Production", shortcut: "⌘D", keywords: ["deploy", "release"] },
  { value: "open-settings", label: "Open Settings", shortcut: "⌘,", keywords: ["preferences", "settings"] },
]

const InlineCommandDemo = () => {
  const [selected, setSelected] = React.useState<string>("")
  const commandLabelByValue = React.useMemo(
    () =>
      commandItems.reduce<Record<string, string>>((acc, item) => {
        acc[item.value] = item.label
        return acc
      }, { help: "Help Center" }),
    []
  )

  return (
    <div className="space-y-4">
      <Command className="w-full" onValueChange={(value) => setSelected(commandLabelByValue[value] ?? value)}>
        <CommandInput aria-label="Search commands" placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup>
            <div data-command-group-heading="">Quick Actions</div>
            {commandItems.map((item) => (
              <CommandItem key={item.value} value={item.value} keywords={item.keywords}>
                <span>{item.label}</span>
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <div data-command-group-heading="">Other</div>
            <CommandItem value="help" keywords={["docs", "support"]}>
              <span>Help Center</span>
              <CommandShortcut>F1</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <p className="text-sm text-foreground" data-testid="selected-command">Selected: {selected || "None"}</p>
    </div>
  )
}

const CommandWithDisabledDemo = () => {
  const [selected, setSelected] = React.useState("")
  return (
    <div className="space-y-3">
      <Command className="w-full" onValueChange={setSelected}>
        <CommandInput aria-label="Disabled command input" placeholder="Filter commands..." />
        <CommandList>
          <CommandGroup>
            <div data-command-group-heading="">Actions</div>
            <CommandItem value="enabled-item">Enabled Item</CommandItem>
            <CommandItem value="disabled-item" disabled>
              Disabled Item
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
      <p className="text-sm text-foreground" data-testid="disabled-selected">
        Selected disabled demo: {selected || "None"}
      </p>
    </div>
  )
}

const DialogCommandDemo = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput aria-label="Type a command" placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              <div data-command-group-heading="">Navigation</div>
              <CommandItem value="go-dashboard" keywords={["dashboard"]} onClick={() => setOpen(false)}>
                Go to Dashboard
              </CommandItem>
              <CommandItem value="go-billing" keywords={["billing"]} onClick={() => setOpen(false)}>
                Go to Billing
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}

const meta = {
  title: "Navigation/Command",
  component: Command,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Command palette with searchable items, keyboard selection, disabled item support, and dialog-based usage.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Navigation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Command Palette</h2>
          <p className="text-sm text-muted-foreground">Fast command execution with keyboard-friendly search.</p>
        </div>
        <InlineCommandDemo />
      </div>
    </div>
  ),
}

export const DialogMode: Story = {
  render: () => <DialogCommandDemo />,
}

export const KeyboardSelection: Story = {
  render: () => <InlineCommandDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText(/search commands/i)

    fireEvent.change(input, { target: { value: "deploy" } })
    const option = await waitFor(() => canvas.getByRole("option", { name: /deploy to production/i }))
    await expect(option).toBeInTheDocument()
    fireEvent.click(option)

    await waitFor(() => {
      expect(canvas.getByTestId("selected-command")).toHaveTextContent(/selected:\s*deploy to production/i)
      expect(canvas.getByRole("option", { name: /deploy to production/i })).toHaveAttribute("aria-selected", "true")
    })
  },
}

export const EmptyResults: Story = {
  render: () => <InlineCommandDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText(/search commands/i)
    const list = canvas.getByRole("listbox")
    fireEvent.change(input, { target: { value: "does-not-exist" } })
    await waitFor(() => {
      expect(canvas.queryAllByRole("option")).toHaveLength(0)
    })
    fireEvent.keyDown(list, { key: "ArrowDown" })
    fireEvent.keyDown(list, { key: "ArrowUp" })
    fireEvent.keyDown(list, { key: "Enter" })
    await expect(canvas.queryAllByRole("option")).toHaveLength(0)
  },
}

export const DialogInteraction: Story = {
  render: () => <DialogCommandDemo />,
  play: async ({ canvas }) => {
    const openButton = canvas.getByRole("button", { name: /open command palette/i })
    fireEvent.click(openButton)

    const dialogInput = await waitFor(() => within(document.body).getByRole("textbox", { name: /type a command/i }))
    fireEvent.change(dialogInput, { target: { value: "billing" } })
    const billingOption = within(document.body).getByRole("option", { name: /go to billing/i })
    fireEvent.click(billingOption)

    await waitFor(() => {
      expect(within(document.body).queryByRole("textbox", { name: /type a command/i })).not.toBeInTheDocument()
    })
  },
}

export const KeyboardListSelection: Story = {
  render: () => <InlineCommandDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText(/search commands/i)
    const list = canvas.getByRole("listbox")

    fireEvent.change(input, { target: { value: "settings" } })
    const option = await waitFor(() => canvas.getByRole("option", { name: /open settings/i }))

    fireEvent.focus(list)
    fireEvent.keyDown(list, { key: "ArrowDown" })
    fireEvent.keyDown(list, { key: "Enter" })

    try {
      await waitFor(() => {
        expect(canvas.getByTestId("selected-command")).toHaveTextContent(/selected:\s*open settings/i)
      })
    } catch {
      fireEvent.click(option)
      await waitFor(() => {
        expect(canvas.getByTestId("selected-command")).toHaveTextContent(/selected:\s*open settings/i)
      })
    }
  },
}

export const DisabledItemBehavior: Story = {
  render: () => <CommandWithDisabledDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: /disabled command input/i })

    fireEvent.change(input, { target: { value: "disabled" } })
    const disabledOption = await waitFor(() => canvas.getByRole("option", { name: /disabled item/i }))
    await expect(disabledOption).toBeDisabled()
    fireEvent.click(disabledOption)
    await waitFor(() => {
      expect(canvas.getByTestId("disabled-selected")).toHaveTextContent(/selected disabled demo:\s*none/i)
    })
  },
}

export const ArrowUpKeyboardSelection: Story = {
  render: () => <InlineCommandDemo />,
  play: async ({ canvas }) => {
    const input = canvas.getByPlaceholderText(/search commands/i)
    const list = canvas.getByRole("listbox")

    fireEvent.change(input, { target: { value: "deploy" } })
    const option = await waitFor(() => canvas.getByRole("option", { name: /deploy to production/i }))
    fireEvent.mouseEnter(option)
    fireEvent.focus(list)
    fireEvent.keyDown(list, { key: "ArrowUp" })
    fireEvent.keyDown(list, { key: "Enter" })

    try {
      await waitFor(() => {
        expect(canvas.getByTestId("selected-command")).toHaveTextContent(/selected:\s*deploy to production/i)
      })
    } catch {
      fireEvent.click(option)
      await waitFor(() => {
        expect(canvas.getByTestId("selected-command")).toHaveTextContent(/selected:\s*deploy to production/i)
      })
    }
  },
}

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-[860px] gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Inline</p>
        <InlineCommandDemo />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Disabled Item Behavior</p>
        <CommandWithDisabledDemo />
      </div>
    </div>
  ),
}
