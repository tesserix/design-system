import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { BarChart, LineChart } from "./charts"

const data = [{ label: "Jan", value: 10 }]

describe("Charts", () => {
  it("renders bar labels", () => {
    render(<BarChart data={data} />)
    expect(screen.getByText("Jan")).toBeInTheDocument()
  })

  it("renders line chart labels", () => {
    render(<LineChart data={data} />)
    expect(screen.getByText("Jan")).toBeInTheDocument()
  })
})
