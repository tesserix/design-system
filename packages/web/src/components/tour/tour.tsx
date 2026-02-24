import * as React from "react"

import { cn } from "../../lib/utils"

export interface TourStep {
  id: string
  title: string
  description: string
  targetSelector?: string
}

export interface TourProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  steps: TourStep[]
  initialStep?: number
}

const Tour = ({ open, onOpenChange, steps, initialStep = 0 }: TourProps) => {
  const [index, setIndex] = React.useState(initialStep)

  React.useEffect(() => {
    if (!open) {
      setIndex(initialStep)
      return
    }

    const step = steps[index]
    if (!step?.targetSelector) return

    const target = document.querySelector(step.targetSelector)
    if (target && "scrollIntoView" in target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [open, index, steps, initialStep])

  if (!open || steps.length === 0) return null

  const step = steps[index]
  const isLast = index === steps.length - 1

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/45" onClick={() => onOpenChange(false)} />
      <div className={cn("absolute bottom-6 left-1/2 w-[min(92vw,480px)] -translate-x-1/2 rounded-2xl border bg-card p-5 shadow-xl")}>
        <p className="text-xs font-medium uppercase tracking-wide text-primary">Step {index + 1} of {steps.length}</p>
        <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5 text-sm"
            disabled={index === 0}
            onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          >
            Back
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => {
              if (isLast) {
                onOpenChange(false)
              } else {
                setIndex((current) => Math.min(current + 1, steps.length - 1))
              }
            }}
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  )
}

const OnboardingTour = Tour

export { Tour, OnboardingTour }
