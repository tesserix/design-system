import * as React from "react"

import { cn } from "../../lib/utils"

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return `${year}-${month}-${day}`
}

const fromDateKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) {
    return undefined
  }
  return new Date(year, month - 1, day)
}

const getMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date)

const getDisplayLabel = (date?: Date) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(date)
    : ""

interface DayCell {
  date: Date
  inCurrentMonth: boolean
}

const getMonthDays = (monthDate: Date): DayCell[] => {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const lastDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const days: DayCell[] = []

  const leadingDays = firstDayOfMonth.getDay()
  for (let i = leadingDays; i > 0; i -= 1) {
    const date = new Date(firstDayOfMonth)
    date.setDate(firstDayOfMonth.getDate() - i)
    days.push({ date, inCurrentMonth: false })
  }

  for (let day = 1; day <= lastDayOfMonth.getDate(); day += 1) {
    days.push({ date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day), inCurrentMonth: true })
  }

  const trailingDays = (7 - (days.length % 7)) % 7
  for (let i = 1; i <= trailingDays; i += 1) {
    const date = new Date(lastDayOfMonth)
    date.setDate(lastDayOfMonth.getDate() + i)
    days.push({ date, inCurrentMonth: false })
  }

  return days
}

const clampToMonth = (date: Date, monthDate: Date) =>
  date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear()
    ? date
    : new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = "Select date",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const dialogId = React.useId()
    const [open, setOpen] = React.useState(false)
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")

    const selectedValue = controlledValue !== undefined ? controlledValue : uncontrolledValue
    const selectedDate = React.useMemo(() => fromDateKey(selectedValue), [selectedValue])

    const [displayMonth, setDisplayMonth] = React.useState<Date>(
      selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date()
    )
    const [focusDate, setFocusDate] = React.useState<Date>(selectedDate ?? new Date())

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!selectedDate) return
      setDisplayMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
      setFocusDate(selectedDate)
    }, [selectedDate])

    React.useEffect(() => {
      const onPointerDown = (event: MouseEvent) => {
        if (!rootRef.current) return
        if (!rootRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", onPointerDown)
      return () => document.removeEventListener("mousedown", onPointerDown)
    }, [])

    const selectDate = React.useCallback(
      (date: Date) => {
        const nextValue = toDateKey(date)
        if (controlledValue === undefined) {
          setUncontrolledValue(nextValue)
        }
        onValueChange?.(nextValue)
        setOpen(false)
      },
      [controlledValue, onValueChange]
    )

    const monthDays = getMonthDays(displayMonth)
    const selectedKey = selectedDate ? toDateKey(selectedDate) : ""
    const focusKey = toDateKey(focusDate)

    return (
      <div ref={rootRef} className={cn("relative w-full", className)} {...props}>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-controls={open ? dialogId : undefined}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          onClick={() => {
            if (disabled) return
            setOpen((current) => !current)
          }}
        >
          <span className={selectedDate ? "text-foreground" : "text-muted-foreground"}>
            {selectedDate ? getDisplayLabel(selectedDate) : placeholder}
          </span>
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
            className="h-4 w-4 opacity-70"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </button>

        {open ? (
          <div
            id={dialogId}
            role="dialog"
            aria-modal="false"
            aria-label="Date picker calendar"
            className="absolute z-50 mt-2 w-[320px] rounded-xl border bg-popover p-3 text-popover-foreground shadow-lg"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                setOpen(false)
                return
              }

              if (event.key === "ArrowLeft") {
                event.preventDefault()
                const nextDate = new Date(focusDate)
                nextDate.setDate(nextDate.getDate() - 1)
                setFocusDate(nextDate)
                if (!clampToMonth(nextDate, displayMonth)) {
                  setDisplayMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
                }
                return
              }

              if (event.key === "ArrowRight") {
                event.preventDefault()
                const nextDate = new Date(focusDate)
                nextDate.setDate(nextDate.getDate() + 1)
                setFocusDate(nextDate)
                if (!clampToMonth(nextDate, displayMonth)) {
                  setDisplayMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
                }
                return
              }

              if (event.key === "ArrowUp") {
                event.preventDefault()
                const nextDate = new Date(focusDate)
                nextDate.setDate(nextDate.getDate() - 7)
                setFocusDate(nextDate)
                if (!clampToMonth(nextDate, displayMonth)) {
                  setDisplayMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
                }
                return
              }

              if (event.key === "ArrowDown") {
                event.preventDefault()
                const nextDate = new Date(focusDate)
                nextDate.setDate(nextDate.getDate() + 7)
                setFocusDate(nextDate)
                if (!clampToMonth(nextDate, displayMonth)) {
                  setDisplayMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1))
                }
                return
              }

              if (event.key === "Enter") {
                event.preventDefault()
                selectDate(focusDate)
              }
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous month"
                className="rounded-md p-1.5 hover:bg-accent"
                onClick={() =>
                  setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
                }
              >
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
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <p className="text-sm font-semibold">{getMonthLabel(displayMonth)}</p>
              <button
                type="button"
                aria-label="Next month"
                className="rounded-md p-1.5 hover:bg-accent"
                onClick={() =>
                  setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
                }
              >
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
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <div role="grid" aria-label="Calendar" className="w-full">
              <div role="row" className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAY_LABELS.map((weekday) => (
                  <span key={weekday} role="columnheader" className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">
                    {weekday}
                  </span>
                ))}
              </div>
              {Array.from({ length: Math.ceil(monthDays.length / 7) }, (_, weekIndex) => (
                <div key={weekIndex} role="row" className="grid grid-cols-7 gap-1">
                  {monthDays.slice(weekIndex * 7, weekIndex * 7 + 7).map(({ date, inCurrentMonth }) => {
                    const dateKey = toDateKey(date)
                    const isSelected = dateKey === selectedKey
                    const isFocused = dateKey === focusKey

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        role="gridcell"
                        aria-selected={isSelected}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors",
                          inCurrentMonth ? "text-foreground" : "text-muted-foreground/60",
                          isFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background",
                          isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onMouseEnter={() => setFocusDate(date)}
                        onClick={() => selectDate(date)}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
