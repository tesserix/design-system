import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { PropertyPanel } from "./property-panel"

const meta = {
  title: "Patterns/PropertyPanel",
  component: PropertyPanel,
  tags: ["autodocs"],
  args: {
    value: {},
    sections: [],
  },
} satisfies Meta<typeof PropertyPanel>

export default meta
type Story = StoryObj<typeof meta>

const ExamplePanel = () => {
  const [value, setValue] = React.useState<Record<string, string>>({
    title: "Homepage Hero",
    status: "draft",
    slug: "homepage-hero",
  })

  return (
    <PropertyPanel
      value={value}
      onValueChange={(nextValue) => setValue(nextValue)}
      sections={[
        {
          id: "general",
          title: "General",
          fields: [
            { id: "title", label: "Title", editable: true },
            {
              id: "status",
              label: "Status",
              editable: true,
              type: "select",
              options: [
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
              ],
            },
            { id: "slug", label: "Slug", editable: false },
          ],
        },
      ]}
    />
  )
}

export const Default: Story = {
  render: () => <ExamplePanel />,
}

export const SmokeTest: Story = {
  render: () => <ExamplePanel />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByDisplayValue("Homepage Hero"), " Updated")
    await expect(canvas.getByDisplayValue("Homepage Hero Updated")).toBeInTheDocument()
  },
}
