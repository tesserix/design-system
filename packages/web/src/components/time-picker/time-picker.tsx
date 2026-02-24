import * as React from "react"

import { cn } from "../../lib/utils"

export interface TimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: Date
  onChange?: (date: Date | undefined) => void
  format?: "12h" | "24h"
  disabled?: boolean
  showSeconds?: boolean
}

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  ({ className, value, onChange, format = "24h", disabled = false, showSeconds = false, ...props }, ref) => {
    const [hours, setHours] = React.useState<number>(value?.getHours() ?? 0)
    const [minutes, setMinutes] = React.useState<number>(value?.getMinutes() ?? 0)
    const [seconds, setSeconds] = React.useState<number>(value?.getSeconds() ?? 0)
    const [period, setPeriod] = React.useState<"AM" | "PM">(
      format === "12h" ? (hours >= 12 ? "PM" : "AM") : "AM"
    )

    React.useEffect(() => {
      if (value) {
        setHours(value.getHours())
        setMinutes(value.getMinutes())
        setSeconds(value.getSeconds())
        setPeriod(value.getHours() >= 12 ? "PM" : "AM")
      }
    }, [value])

    const updateTime = React.useCallback(
      (newHours: number, newMinutes: number, newSeconds: number) => {
        const date = new Date()
        date.setHours(newHours)
        date.setMinutes(newMinutes)
        date.setSeconds(newSeconds)
        onChange?.(date)
      },
      [onChange]
    )

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) || 0
      const maxHours = format === "12h" ? 12 : 23
      const clampedVal = Math.max(0, Math.min(maxHours, val))

      let actualHours = clampedVal
      if (format === "12h") {
        if (period === "PM" && clampedVal !== 12) {
          actualHours = clampedVal + 12
        } else if (period === "AM" && clampedVal === 12) {
          actualHours = 0
        }
      }

      setHours(actualHours)
      updateTime(actualHours, minutes, seconds)
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) || 0
      const clampedVal = Math.max(0, Math.min(59, val))
      setMinutes(clampedVal)
      updateTime(hours, clampedVal, seconds)
    }

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value) || 0
      const clampedVal = Math.max(0, Math.min(59, val))
      setSeconds(clampedVal)
      updateTime(hours, minutes, clampedVal)
    }

    const handlePeriodToggle = () => {
      const newPeriod = period === "AM" ? "PM" : "AM"
      setPeriod(newPeriod)

      let newHours = hours
      if (newPeriod === "PM" && hours < 12) {
        newHours = hours + 12
      } else if (newPeriod === "AM" && hours >= 12) {
        newHours = hours - 12
      }

      setHours(newHours)
      updateTime(newHours, minutes, seconds)
    }

    const displayHours = format === "12h"
      ? (hours === 0 ? 12 : hours > 12 ? hours - 12 : hours)
      : hours

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-md border bg-background p-2",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        <input
          type="number"
          value={displayHours.toString().padStart(2, "0")}
          onChange={handleHoursChange}
          disabled={disabled}
          min={format === "12h" ? 1 : 0}
          max={format === "12h" ? 12 : 23}
          className={cn(
            "w-12 rounded border bg-background px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          aria-label="Hours"
        />
        <span className="text-sm font-medium">:</span>
        <input
          type="number"
          value={minutes.toString().padStart(2, "0")}
          onChange={handleMinutesChange}
          disabled={disabled}
          min={0}
          max={59}
          className={cn(
            "w-12 rounded border bg-background px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          aria-label="Minutes"
        />
        {showSeconds && (
          <>
            <span className="text-sm font-medium">:</span>
            <input
              type="number"
              value={seconds.toString().padStart(2, "0")}
              onChange={handleSecondsChange}
              disabled={disabled}
              min={0}
              max={59}
              className={cn(
                "w-12 rounded border bg-background px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              )}
              aria-label="Seconds"
            />
          </>
        )}
        {format === "12h" && (
          <button
            type="button"
            onClick={handlePeriodToggle}
            disabled={disabled}
            className={cn(
              "ml-1 rounded border bg-background px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            aria-label="Toggle AM/PM"
          >
            {period}
          </button>
        )}
      </div>
    )
  }
)
TimePicker.displayName = "TimePicker"

export { TimePicker }
