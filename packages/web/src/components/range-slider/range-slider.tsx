import * as React from "react"

import { cn } from "../../lib/utils"

export interface RangeSliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  defaultValue?: [number, number]
  onChange?: (value: [number, number]) => void
  disabled?: boolean
  showLabels?: boolean
}

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = [min, max],
      onChange,
      disabled = false,
      showLabels = true,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<[number, number]>(
      value || defaultValue
    )
    const trackRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = React.useState<"min" | "max" | null>(null)

    const currentValue = value || internalValue

    const percentMin = ((currentValue[0] - min) / (max - min)) * 100
    const percentMax = ((currentValue[1] - min) / (max - min)) * 100

    const updateValue = React.useCallback(
      (newValue: [number, number]) => {
        const clampedValue: [number, number] = [
          Math.max(min, Math.min(newValue[0], newValue[1])),
          Math.min(max, Math.max(newValue[0], newValue[1])),
        ]

        if (!value) {
          setInternalValue(clampedValue)
        }
        onChange?.(clampedValue)
      },
      [min, max, onChange, value]
    )

    const getValueFromPosition = (clientX: number) => {
      if (!trackRef.current) return min

      const rect = trackRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const rawValue = min + percent * (max - min)
      const steppedValue = Math.round(rawValue / step) * step

      return Math.max(min, Math.min(max, steppedValue))
    }

    const handleMouseDown = (handle: "min" | "max") => (e: React.MouseEvent) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(handle)
    }

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging || disabled) return

        const newValue = getValueFromPosition(e.clientX)

        if (isDragging === "min") {
          updateValue([newValue, currentValue[1]])
        } else {
          updateValue([currentValue[0], newValue])
        }
      },
      [isDragging, disabled, currentValue, updateValue]
    )

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(null)
    }, [])

    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
        }
      }
    }, [isDragging, handleMouseMove, handleMouseUp])

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || e.target !== trackRef.current) return

      const newValue = getValueFromPosition(e.clientX)
      const midpoint = (currentValue[0] + currentValue[1]) / 2

      if (newValue < midpoint) {
        updateValue([newValue, currentValue[1]])
      } else {
        updateValue([currentValue[0], newValue])
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-2 rounded-full bg-secondary cursor-pointer"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-full rounded-full bg-primary"
            style={{
              left: `${percentMin}%`,
              right: `${100 - percentMax}%`,
            }}
          />

          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-primary border-2 border-background shadow-md transition-transform cursor-grab",
              isDragging === "min" && "scale-110 cursor-grabbing",
              disabled && "cursor-not-allowed"
            )}
            style={{ left: `${percentMin}%` }}
            onMouseDown={handleMouseDown("min")}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue[0]}
            aria-label="Minimum value"
            tabIndex={disabled ? -1 : 0}
          />

          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-primary border-2 border-background shadow-md transition-transform cursor-grab",
              isDragging === "max" && "scale-110 cursor-grabbing",
              disabled && "cursor-not-allowed"
            )}
            style={{ left: `${percentMax}%` }}
            onMouseDown={handleMouseDown("max")}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue[1]}
            aria-label="Maximum value"
            tabIndex={disabled ? -1 : 0}
          />
        </div>

        {showLabels && (
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>{currentValue[0]}</span>
            <span>{currentValue[1]}</span>
          </div>
        )}
      </div>
    )
  }
)
RangeSlider.displayName = "RangeSlider"

export { RangeSlider }
