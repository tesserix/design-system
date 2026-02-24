import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { VirtualList } from "./virtual-list"

const items = Array.from({ length: 200 }, (_, i) => `Row ${i + 1}`)

const meta = {
  title: "Data Display/VirtualList",
  component: VirtualList,
  tags: ["autodocs"],
  args: {
    items: [],
    itemHeight: 36,
    height: 300,
    renderItem: (item: unknown) => <div>{String(item)}</div>,
  },
} satisfies Meta<typeof VirtualList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [],
    itemHeight: 36,
    height: 300,
    renderItem: (item: unknown) => <div>{String(item)}</div>,
  },
  render: () => (
    <VirtualList
      items={items}
      itemHeight={36}
      height={300}
      renderItem={(item) => <div className="border-b px-3 py-2 text-sm">{item}</div>}
    />
  ),
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
