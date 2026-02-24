import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { Icon, IconLibrary } from "./icon-library"

const meta = {
  title: "Utilities/IconLibrary",
  component: IconLibrary,
  tags: ["autodocs"],
} satisfies Meta<typeof IconLibrary>

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {}

export const SingleIcon: Story = {
  render: () => <Icon name="search" size={20} />,
}

export const SmokeTest: Story = {
  render: Catalog.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
