import * as React from "react"

import { cn } from "../../lib/utils"

export interface DateRangeValue {
  start?: string
  end?: string
}

export interface DateRangePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "value" | "onChange"> {
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  onValueChange?: (value: DateRangeValue) => void
  disabled?: boolean
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  ({ className, value: controlledValue, defaultValue = {}, onValueChange, disabled = false, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState<DateRangeValue>(defaultValue)

    const value = controlledValue ?? uncontrolledValue

    const setValue = React.useCallback(
      (nextValue: DateRangeValue) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(nextValue)
        }
        onValueChange?.(nextValue)
      },
      [controlledValue, onValueChange]
    )

    return (
      <div ref={ref} className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)} {...props}>
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Start date</span>
          <input
            type="date"
            value={value.start ?? ""}
            disabled={disabled}
            onChange={(event) => setValue({ ...value, start: event.target.value || undefined })}
            className={cn(
              "h-11 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">End date</span>
          <input
            type="date"
            value={value.end ?? ""}
            disabled={disabled}
            min={value.start}
            onChange={(event) => setValue({ ...value, end: event.target.value || undefined })}
            className={cn(
              "h-11 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm",
              "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </label>
      </div>
    )
  }
)
DateRangePicker.displayName = "DateRangePicker"

export { DateRangePicker }
