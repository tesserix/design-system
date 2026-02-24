import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { SearchBar } from "./search-bar"

const meta = {
  title: "Patterns/SearchBar",
  component: SearchBar,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <SearchBar className="w-[480px]" />,
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
