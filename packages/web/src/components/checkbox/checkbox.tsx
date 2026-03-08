import * as React from "react"

import { cn } from "../../lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, onChange, onCheckedChange, ...props }, ref) => {
    const id = React.useId()
    const inputId = props.id || id

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    const inputElement = (
      <input
        type="checkbox"
        id={inputId}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded border-2 border-input bg-background shadow-sm transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
          "checked:bg-primary checked:border-primary checked:text-primary-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer",
          !label && !description && className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )

    if (label || description) {
      return (
        <label htmlFor={inputId} className={cn("flex items-start gap-3 cursor-pointer group", className)}>
          <div className="mt-0.5">{inputElement}</div>
          <div className="flex-1">
            {label && (
              <span className="font-medium text-foreground block">{label}</span>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </label>
      )
    }

    return inputElement
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
