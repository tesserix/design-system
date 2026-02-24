import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DataGridSkeleton, DataTableSkeleton, PanelSkeleton, Skeleton } from "./skeleton"

describe("Skeleton", () => {
  it("renders base skeleton", () => {
    const { container } = render(<Skeleton className="h-4 w-10" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("renders data table skeleton rows", () => {
    const { container } = render(<DataTableSkeleton rows={3} />)
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(3)
  })

  it("renders panel skeleton", () => {
    const { container } = render(<PanelSkeleton />)
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0)
  })

  it("renders data grid skeleton", () => {
    const { container } = render(<DataGridSkeleton rows={2} />)
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(2)
  })
})
