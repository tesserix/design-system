import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const InteractivePagination = () => {
  const [page, setPage] = React.useState(3)

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage((current) => Math.max(1, current - 1))} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 2} onClick={() => setPage(2)}>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 3} onClick={() => setPage(3)}>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 10} onClick={() => setPage(10)}>
              10
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => setPage((current) => Math.min(10, current + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-sm text-muted-foreground">Current page: {page}</p>
    </div>
  )
}

const BoundaryPagination = () => {
  const [page, setPage] = React.useState(1)

  return (
    <div className="space-y-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 2} onClick={() => setPage(2)}>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={page === 3} onClick={() => setPage(3)}>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              disabled={page === 3}
              onClick={() => setPage((current) => Math.min(3, current + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-sm text-muted-foreground">Current page: {page}</p>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Navigation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Pagination Showcase</h2>
          <p className="text-sm text-muted-foreground">Compact controls for page-based content navigation.</p>
        </div>
        <InteractivePagination />
      </div>
    </div>
  ),
}

export const KeyboardAndClick: Story = {
  render: () => <InteractivePagination />,
  play: async ({ canvas }) => {
    const nextButton = canvas.getByRole("button", { name: /go to next page/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(canvas.getByText(/current page: 4/i)).toBeInTheDocument()
    })

    const page10 = canvas.getByRole("button", { name: "10" })
    fireEvent.click(page10)
    await waitFor(() => {
      expect(page10).toHaveAttribute("aria-current", "page")
    })
  },
}

export const BoundaryStates: Story = {
  render: () => <BoundaryPagination />,
  play: async ({ canvas }) => {
    const prev = canvas.getByRole("button", { name: /go to previous page/i })
    const next = canvas.getByRole("button", { name: /go to next page/i })

    await expect(prev).toBeDisabled()
    await expect(canvas.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page")

    fireEvent.click(next)
    fireEvent.click(next)
    await waitFor(() => {
      expect(canvas.getByText(/current page: 3/i)).toBeInTheDocument()
      expect(next).toBeDisabled()
      expect(canvas.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page")
    })
  },
}
