import * as React from "react"

import { cn } from "../../lib/utils"

interface StepperContextValue {
  currentStep: number
  totalSteps: number
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

const useStepper = () => {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("Stepper components must be used within Stepper")
  }
  return context
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
  totalSteps: number
  orientation?: "horizontal" | "vertical"
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, currentStep, totalSteps, orientation = "horizontal", children, ...props }, ref) => (
    <StepperContext.Provider value={{ currentStep, totalSteps }}>
      <div
        ref={ref}
        role="list"
        aria-label="Progress steps"
        className={cn(
          "flex w-full",
          orientation === "horizontal" ? "items-start" : "flex-col gap-3",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  )
)
Stepper.displayName = "Stepper"

export interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  title: string
  description?: string
  orientation?: "horizontal" | "vertical"
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  ({ className, step, title, description, orientation = "horizontal", ...props }, ref) => {
    const { currentStep, totalSteps } = useStepper()
    const isCompleted = step < currentStep
    const isCurrent = step === currentStep
    const isUpcoming = step > currentStep
    const showConnector = step < totalSteps

    return (
      <div
        ref={ref}
        role="listitem"
        aria-current={isCurrent ? "step" : undefined}
        className={cn(
          "relative flex",
          orientation === "horizontal" ? "flex-1 flex-col items-start" : "items-start gap-3",
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center", orientation === "horizontal" ? "w-full" : "min-h-[2.5rem]")}>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
              isCompleted && "border-primary bg-primary text-primary-foreground",
              isCurrent && "border-primary bg-background text-primary",
              isUpcoming && "border-border bg-background text-muted-foreground"
            )}
          >
            {isCompleted ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              step
            )}
          </div>

          {showConnector && orientation === "horizontal" ? (
            <div className="mx-3 h-px flex-1 bg-border" />
          ) : null}
        </div>

        <div className={cn("mt-2", orientation === "horizontal" ? "pr-4" : "pt-0")}>
          <p
            className={cn(
              "text-sm font-semibold",
              isCurrent ? "text-foreground" : isCompleted ? "text-foreground/90" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>

        {showConnector && orientation === "vertical" ? (
          <div className="absolute left-[17px] top-10 h-6 w-px bg-border" />
        ) : null}
      </div>
    )
  }
)
StepperItem.displayName = "StepperItem"

export { Stepper, StepperItem }
