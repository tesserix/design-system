import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Rating } from "./rating"

const meta = {
  title: "Input/Rating",
  component: Rating,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(3)
    return <Rating value={value} onChange={setValue} />
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}

export const Readonly: Story = {
  render: () => <Rating value={4} readonly />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Rating value={3} size="sm" />
      <Rating value={3} size="md" />
      <Rating value={3} size="lg" />
    </div>
  ),
}
