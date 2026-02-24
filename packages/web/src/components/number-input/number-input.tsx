import * as React from "react"

import { cn } from "../../lib/utils"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
}

const clamp = (value: number, min?: number, max?: number) => {
  if (min != null && value < min) return min
  if (max != null && value > max) return max
  return value
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      min,
      max,
      step = 1,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(clamp(defaultValue, min, max))
    const [draft, setDraft] = React.useState(String(clamp(defaultValue, min, max)))

    const isControlled = controlledValue !== undefined
    const value = clamp(isControlled ? controlledValue : internalValue, min, max)

    React.useEffect(() => {
      setDraft(String(value))
    }, [value])

    const commitValue = React.useCallback(
      (nextValue: number) => {
        const clamped = clamp(nextValue, min, max)
        if (!isControlled) {
          setInternalValue(clamped)
        }
        onValueChange?.(clamped)
        setDraft(String(clamped))
      },
      [isControlled, min, max, onValueChange]
    )

    const increment = () => commitValue(value + step)
    const decrement = () => commitValue(value - step)

    return (
      <div className={cn("inline-flex w-full max-w-[220px] items-stretch rounded-lg border border-input bg-background", className)}>
        <button
          type="button"
          aria-label="Decrease value"
          disabled={disabled || (min != null && value <= min)}
          onClick={decrement}
          className="inline-flex w-10 items-center justify-center border-r text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          -
        </button>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          aria-label={props["aria-label"] ?? "Number input"}
          disabled={disabled}
          value={draft}
          onChange={(event) => {
            const raw = event.target.value
            if (/^-?\d*\.?\d*$/.test(raw)) {
              setDraft(raw)
            }
          }}
          onBlur={() => {
            const parsed = Number(draft)
            if (!Number.isFinite(parsed)) {
              setDraft(String(value))
              return
            }
            commitValue(parsed)
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault()
              increment()
              return
            }
            if (event.key === "ArrowDown") {
              event.preventDefault()
              decrement()
              return
            }
            if (event.key === "Enter") {
              event.preventDefault()
              const parsed = Number(draft)
              if (Number.isFinite(parsed)) {
                commitValue(parsed)
              }
            }
          }}
          className="h-10 flex-1 bg-transparent px-3 text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
          {...props}
        />
        <button
          type="button"
          aria-label="Increase value"
          disabled={disabled || (max != null && value >= max)}
          onClick={increment}
          className="inline-flex w-10 items-center justify-center border-l text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
