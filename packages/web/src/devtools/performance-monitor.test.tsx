import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { PerformanceMonitor } from "./performance-monitor"

describe("PerformanceMonitor", () => {
  it("renders monitor details", () => {
    render(<PerformanceMonitor />)
    expect(screen.getByText(/Render Count/)).toBeInTheDocument()
  })
})
