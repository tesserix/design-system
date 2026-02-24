import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { Step, Steps } from "./steps"

describe("Steps", () => {
  it("renders step titles", () => {
    render(
      <Steps currentStep={1} totalSteps={2}>
        <Step step={1} title="A" />
        <Step step={2} title="B" />
      </Steps>
    )

    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})
