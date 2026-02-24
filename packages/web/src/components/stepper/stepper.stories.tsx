import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { expect, fireEvent, waitFor } from "storybook/test"

import { Button } from "../button"
import { Stepper, StepperItem } from "./stepper"

const stepData = [
  { title: "Account", description: "Create your profile and credentials." },
  { title: "Workspace", description: "Configure preferences and team settings." },
  { title: "Review", description: "Validate details before completion." },
]

const InteractiveStepper = ({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) => {
  const [currentStep, setCurrentStep] = React.useState(2)

  return (
    <div className="space-y-4">
      <Stepper currentStep={currentStep} totalSteps={stepData.length} orientation={orientation}>
        {stepData.map((step, index) => (
          <StepperItem
            key={step.title}
            step={index + 1}
            title={step.title}
            description={step.description}
            orientation={orientation}
          />
        ))}
      </Stepper>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setCurrentStep((current) => Math.max(1, current - 1))}
        >
          Previous
        </Button>
        <Button onClick={() => setCurrentStep((current) => Math.min(stepData.length, current + 1))}>
          Next
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Current step: {currentStep}</p>
    </div>
  )
}

const meta = {
  title: "Navigation/Stepper",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border bg-card p-6 shadow-lg md:p-8">
        <div className="mb-6 space-y-1">
          <p className="text-sm font-medium text-primary">Navigation</p>
          <h2 className="text-2xl font-bold tracking-tight text-card-foreground">Stepper Showcase</h2>
          <p className="text-sm text-muted-foreground">Progress indicators for multi-step workflows.</p>
        </div>
        <InteractiveStepper />
      </div>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="w-[360px]">
      <InteractiveStepper orientation="vertical" />
    </div>
  ),
}

export const AdvanceStep: Story = {
  render: () => <InteractiveStepper />,
  play: async ({ canvas }) => {
    const nextButton = canvas.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(canvas.getByText(/current step: 3/i)).toBeInTheDocument()
    })
    const currentStepElement = canvas.getByRole("listitem", { current: "step" })
    await waitFor(() => {
      expect(currentStepElement).toHaveTextContent(/review/i)
    })
  },
}
