import * as React from "react"

import { cn } from "../../lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={cn(
          "peer h-5 w-5 shrink-0 rounded border-2 border-input bg-background shadow-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
          "checked:bg-primary checked:border-primary checked:text-primary-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
