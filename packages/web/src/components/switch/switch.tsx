import * as React from "react"

import { cn } from "../../lib/utils"

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className={cn("relative inline-flex cursor-pointer items-center", className)}>
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          {...props}
        />
        <div className={cn(
          "peer h-6 w-11 rounded-full bg-input shadow-sm transition-all duration-200",
          "after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-background after:shadow-md after:transition-all after:content-['']",
          "peer-checked:bg-primary peer-checked:after:translate-x-5",
          "peer-focus-visible:ring-4 peer-focus-visible:ring-ring/20",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        )} />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
