import * as React from "react"

import { cn } from "../../lib/utils"

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="radio"
        className={cn(
          "peer h-5 w-5 shrink-0 rounded-full border-2 border-input bg-background shadow-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
          "checked:border-primary checked:bg-primary",
          "checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2 checked:after:w-2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:rounded-full checked:after:bg-primary-foreground checked:after:content-['']",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer relative",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Radio.displayName = "Radio"

export { Radio }
