import * as React from "react"

import { cn } from "../../lib/utils"

export interface WizardStep {
  id: string
  title: string
  description?: string
  content: React.ReactNode
}

export interface WizardStepFormProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  steps: WizardStep[]
  initialStep?: number
  onStepChange?: (stepIndex: number) => void
  onSubmit?: () => void
  canGoNext?: (stepIndex: number) => boolean
}

const WizardStepForm = React.forwardRef<HTMLDivElement, WizardStepFormProps>(
  ({ className, steps, initialStep = 0, onStepChange, onSubmit, canGoNext, ...props }, ref) => {
    const [currentStep, setCurrentStep] = React.useState(initialStep)
    const total = steps.length
    const current = steps[currentStep]

    const goTo = (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next))
      setCurrentStep(clamped)
      onStepChange?.(clamped)
    }

    const isLast = currentStep === total - 1
    const allowNext = canGoNext ? canGoNext(currentStep) : true

    return (
      <div ref={ref} className={cn("space-y-4 rounded-xl border bg-card p-4", className)} {...props}>
        <ol className="flex flex-wrap gap-2" aria-label="Wizard steps">
          {steps.map((step, index) => (
            <li key={step.id}>
              <button
                type="button"
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm",
                  index === currentStep ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"
                )}
                onClick={() => goTo(index)}
                aria-current={index === currentStep ? "step" : undefined}
              >
                {index + 1}. {step.title}
              </button>
            </li>
          ))}
        </ol>

        {current ? (
          <section className="space-y-1" aria-label="Current step content">
            <h3 className="text-base font-semibold">{current.title}</h3>
            {current.description ? <p className="text-sm text-muted-foreground">{current.description}</p> : null}
            <div className="pt-2">{current.content}</div>
          </section>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            onClick={() => goTo(currentStep - 1)}
            disabled={currentStep === 0}
          >
            Back
          </button>

          {isLast ? (
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              onClick={() => onSubmit?.()}
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
              onClick={() => goTo(currentStep + 1)}
              disabled={!allowNext}
            >
              Next
            </button>
          )}
        </div>
      </div>
    )
  }
)
WizardStepForm.displayName = "WizardStepForm"

export { WizardStepForm }
