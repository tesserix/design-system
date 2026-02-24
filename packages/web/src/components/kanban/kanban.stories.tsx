import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test"

import { Kanban } from "./kanban"

const meta = {
  title: "Data Visualization/Kanban",
  component: Kanban,
  tags: ["autodocs"],
  args: {
    columns: [
      { id: "todo", title: "To Do", cards: [{ id: "1", title: "Define scope" }] },
      { id: "doing", title: "In Progress", cards: [{ id: "2", title: "Build component" }] },
      { id: "done", title: "Done", cards: [{ id: "3", title: "Publish docs" }] },
    ],
  },
} satisfies Meta<typeof Kanban>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MoveCards: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [firstLeft, firstRight] = canvas.getAllByRole("button", { name: /Left|Right/ })

    await userEvent.click(firstLeft)
    await waitFor(() => {
      const todoSection = canvas.getByText("To Do").closest("section") as HTMLElement
      expect(within(todoSection).getByText("Define scope")).toBeInTheDocument()
    })

    await userEvent.click(firstRight)

    await waitFor(() => {
      const todoSection = canvas.getByText("To Do").closest("section") as HTMLElement
      const doingSection = canvas.getByText("In Progress").closest("section") as HTMLElement
      expect(within(todoSection).queryByText("Define scope")).not.toBeInTheDocument()
      expect(within(doingSection).getByText("Define scope")).toBeInTheDocument()
    })

    fireEvent.click(firstRight)

    const rights = canvas.getAllByRole("button", { name: "Right" })
    await userEvent.click(rights[rights.length - 1] as HTMLButtonElement)
  },
}
