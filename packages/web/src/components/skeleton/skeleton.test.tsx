import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { DataGridSkeleton, DataTableSkeleton, PanelSkeleton, Skeleton, SkeletonShimmer, TextSkeleton, AvatarSkeleton, ButtonSkeleton, TableRowSkeleton } from "./skeleton"

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

  it("renders shimmer skeleton", () => {
    const { container } = render(<SkeletonShimmer className="h-4 w-10" />)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("bg-muted")
  })

  it("renders text skeleton with configurable lines", () => {
    const { container } = render(<TextSkeleton lines={4} />)
    expect(container.querySelectorAll(".animate-pulse").length).toBe(4)
  })

  it("renders avatar skeleton with size", () => {
    const { container } = render(<AvatarSkeleton size="lg" />)
    expect(container.firstChild).toHaveClass("rounded-full", "h-12", "w-12")
  })

  it("renders button skeleton with size", () => {
    const { container } = render(<ButtonSkeleton size="sm" />)
    expect(container.firstChild).toHaveClass("rounded-lg", "h-9", "w-20")
  })

  it("renders table row skeleton with configurable columns", () => {
    const { container } = render(<TableRowSkeleton columns={3} />)
    expect(container.querySelectorAll(".animate-pulse").length).toBe(3)
  })
})
