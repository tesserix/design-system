import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, within } from "storybook/test"

import { Carousel } from "./carousel"

const meta = {
  title: "Data Display/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  args: {
    items: [
      <div key="1" className="grid h-48 place-items-center bg-muted">Slide 1</div>,
      <div key="2" className="grid h-48 place-items-center bg-muted">Slide 2</div>,
      <div key="3" className="grid h-48 place-items-center bg-muted">Slide 3</div>,
    ],
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Framed: Story = {
  render: (args) => (
    <div className="w-full max-w-2xl rounded-2xl border bg-card p-4">
      <Carousel {...args} />
    </div>
  ),
}

export const AutoPlay: Story = {
  args: { autoplay: true, interval: 2000 },
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await expect(canvas.getByText("Slide 2")).toBeTruthy()
  },
}
