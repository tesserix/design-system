import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { SettingsPanel } from "./settings-panel"

describe("SettingsPanel", () => {
  it("renders section title", () => {
    render(<SettingsPanel sections={[{ id: "a", title: "General", content: null }]} />)
    expect(screen.getByText("General")).toBeInTheDocument()
  })

  it("renders section content", () => {
    render(<SettingsPanel sections={[{ id: "a", title: "General", content: <span>Enabled</span> }]} />)
    expect(screen.getByText("Enabled")).toBeInTheDocument()
  })
})
