import * as React from "react"

import { cn } from "../../lib/utils"

const dayOrder = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const

type Day = (typeof dayOrder)[number]

export interface CronBuilderValue {
  frequency: "hourly" | "weekly"
  interval: number
  minute: number
  hour: number
  days: Day[]
}

export interface CronBuilderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: CronBuilderValue
  onValueChange?: (value: CronBuilderValue) => void
}

const defaultValue: CronBuilderValue = {
  frequency: "hourly",
  interval: 1,
  minute: 0,
  hour: 9,
  days: ["MON"],
}

export const toCronExpression = (value: CronBuilderValue): string => {
  if (value.frequency === "hourly") {
    return `${value.minute} */${Math.max(1, value.interval)} * * *`
  }

  const numericDays = value.days
    .map((day) => dayOrder.indexOf(day))
    .filter((day) => day >= 0)
    .join(",")

  return `${value.minute} ${value.hour} * * ${numericDays || "1"}`
}

const CronBuilder = React.forwardRef<HTMLDivElement, CronBuilderProps>(
  ({ className, value, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<CronBuilderValue>(value ?? defaultValue)

    React.useEffect(() => {
      if (value) setInternalValue(value)
    }, [value])

    const emit = (next: CronBuilderValue) => {
      setInternalValue(next)
      onValueChange?.(next)
    }

    const toggleDay = (day: Day) => {
      const days = internalValue.days.includes(day)
        ? internalValue.days.filter((item) => item !== day)
        : [...internalValue.days, day]
      emit({ ...internalValue, days })
    }

    return (
      <div ref={ref} className={cn("space-y-4 rounded-xl border p-4", className)} {...props}>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">Frequency</span>
            <select
              value={internalValue.frequency}
              onChange={(event) =>
                emit({
                  ...internalValue,
                  frequency: event.target.value as CronBuilderValue["frequency"],
                })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2"
            >
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>

          {internalValue.frequency === "hourly" ? (
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Every N hours</span>
              <input
                type="number"
                min={1}
                value={internalValue.interval}
                onChange={(event) =>
                  emit({ ...internalValue, interval: Number(event.target.value) || 1 })
                }
                className="h-9 w-full rounded-md border border-input bg-background px-2"
              />
            </label>
          ) : (
            <>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Hour (0-23)</span>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={internalValue.hour}
                  onChange={(event) =>
                    emit({
                      ...internalValue,
                      hour: Math.min(23, Math.max(0, Number(event.target.value) || 0)),
                    })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-2"
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-muted-foreground">Minute (0-59)</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={internalValue.minute}
                  onChange={(event) =>
                    emit({
                      ...internalValue,
                      minute: Math.min(59, Math.max(0, Number(event.target.value) || 0)),
                    })
                  }
                  className="h-9 w-full rounded-md border border-input bg-background px-2"
                />
              </label>
            </>
          )}
        </div>

        {internalValue.frequency === "weekly" ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Days</p>
            <div className="flex flex-wrap gap-2">
              {dayOrder.map((day) => (
                <label key={day} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={internalValue.days.includes(day)}
                    onChange={() => toggleDay(day)}
                    aria-label={day}
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-md bg-muted/40 px-3 py-2 font-mono text-xs">
          {toCronExpression(internalValue)}
        </div>
      </div>
    )
  }
)
CronBuilder.displayName = "CronBuilder"

export { CronBuilder }
