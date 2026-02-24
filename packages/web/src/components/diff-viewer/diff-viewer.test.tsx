import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { DiffViewer } from "./diff-viewer"

describe("DiffViewer", () => {
  it("shows modified lines", () => {
    render(
      <DiffViewer
        oldValue={"status: draft"}
        newValue={"status: published"}
      />
    )

    expect(screen.getByText((content) => content.includes("status: draft"))).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes("status: published"))).toBeInTheDocument()
  })

  it("renders unified output", () => {
    render(
      <DiffViewer
        oldValue={"a"}
        newValue={"b"}
        view="unified"
      />
    )

    expect(screen.getByText(/b/)).toBeInTheDocument()
  })

  it("supports hidden line numbers", () => {
    render(
      <DiffViewer
        oldValue={"line"}
        newValue={"line"}
        showLineNumbers={false}
      />
    )

    expect(screen.getAllByText("line").length).toBeGreaterThan(0)
  })
})
