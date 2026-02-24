import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"

import { WizardStepForm } from "./wizard-step-form"

describe("WizardStepForm", () => {
  const steps = [
    { id: "one", title: "One", content: <p>First</p> },
    { id: "two", title: "Two", content: <p>Second</p> },
  ]

  it("navigates between steps", () => {
    render(<WizardStepForm steps={steps} />)

    expect(screen.getByText("First")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByText("Second")).toBeInTheDocument()
  })

  it("calls onSubmit on last step", () => {
    const onSubmit = vi.fn()
    render(<WizardStepForm steps={steps} initialStep={1} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole("button", { name: "Submit" }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it("respects canGoNext guard", () => {
    render(<WizardStepForm steps={steps} canGoNext={() => false} />)
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })
})
