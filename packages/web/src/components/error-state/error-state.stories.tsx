import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "storybook/test"

import { ErrorState } from "./error-state"

const meta = {
  title: "Feedback/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    type: { control: "select", options: ["access_denied", "not_found", "forbidden", "server_error", "permission_denied", "network_error", "timeout", "requires_auth", "custom"] },
    compact: { control: "boolean" },
    showRetryButton: { control: "boolean" },
    showHomeButton: { control: "boolean" },
    showSuggestions: { control: "boolean" },
  },
} satisfies Meta<typeof ErrorState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { type: "server_error", showRetryButton: true },
}

export const NotFound: Story = {
  args: { type: "not_found", showHomeButton: true },
}

export const AccessDenied: Story = {
  args: { type: "access_denied", showRetryButton: true, showHomeButton: true },
}

export const NetworkError: Story = {
  args: { type: "network_error", showRetryButton: true },
}

export const Compact: Story = {
  args: { type: "server_error", compact: true, showRetryButton: true },
  parameters: { layout: "centered" },
}

export const WithDetails: Story = {
  args: {
    type: "server_error",
    showRetryButton: true,
    code: "ERR_500",
    details: "TypeError: Cannot read properties of undefined\n  at fetchData (api.ts:42)\n  at Dashboard (page.tsx:15)",
  },
}

export const WithCustomActions: Story = {
  args: {
    type: "requires_auth",
    actions: [
      { label: "Log In", onClick: fn(), variant: "default" },
      { label: "Go Back", onClick: fn(), variant: "outline" },
    ],
  },
}
