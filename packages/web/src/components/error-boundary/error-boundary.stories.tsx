import type { Meta, StoryObj } from "@storybook/react"

import { ChartErrorBoundary, ComponentErrorBoundary, WidgetErrorBoundary } from "./error-boundary"

function BrokenComponent() {
  throw new Error("Test error")
}

function WorkingComponent() {
  return <div className="p-4 text-center">This component works fine!</div>
}

const meta = {
  title: "Feedback/ComponentErrorBoundary",
  component: ComponentErrorBoundary,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ComponentErrorBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const WithError: Story = {
  render: () => (
    <div className="w-96">
      <ComponentErrorBoundary showDetails>
        <BrokenComponent />
      </ComponentErrorBoundary>
    </div>
  ),
}

export const WithoutError: Story = {
  render: () => (
    <ComponentErrorBoundary>
      <WorkingComponent />
    </ComponentErrorBoundary>
  ),
}

export const WidgetError: Story = {
  render: () => (
    <div className="w-64 h-64 border rounded-lg">
      <WidgetErrorBoundary title="Sales Widget">
        <BrokenComponent />
      </WidgetErrorBoundary>
    </div>
  ),
}

export const ChartError: Story = {
  render: () => (
    <div className="w-96 h-64">
      <ChartErrorBoundary>
        <BrokenComponent />
      </ChartErrorBoundary>
    </div>
  ),
}
