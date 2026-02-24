import * as React from "react"

import {
  Stepper,
  StepperItem,
  type StepperProps,
  type StepperItemProps,
} from "../stepper"

export interface StepsProps extends StepperProps {}
export interface StepProps extends StepperItemProps {}

const Steps = React.forwardRef<HTMLDivElement, StepsProps>((props, ref) => <Stepper ref={ref} {...props} />)
Steps.displayName = "Steps"

const Step = React.forwardRef<HTMLDivElement, StepProps>((props, ref) => <StepperItem ref={ref} {...props} />)
Step.displayName = "Step"

export { Steps, Step }
