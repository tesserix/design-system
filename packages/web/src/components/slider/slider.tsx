import * as React from "react"
import { cn } from "../../lib/utils"

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  min?: number
  max?: number
  step?: number
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value,
      defaultValue = [0],
      onValueChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<number[]>(
      value || defaultValue
    )
    const trackRef = React.useRef<HTMLDivElement>(null)
    const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null)

    const currentValue = value || internalValue

    const updateValue = React.useCallback(
      (newValue: number[]) => {
        const clamped = newValue.map(v =>
          Math.max(min, Math.min(max, Math.round(v / step) * step))
        ).sort((a, b) => a - b)

        if (!value) {
          setInternalValue(clamped)
        }
        onValueChange?.(clamped)
      },
      [min, max, step, onValueChange, value]
    )

    const getValueFromPosition = React.useCallback((clientX: number) => {
      if (!trackRef.current) return min
      const rect = trackRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return min + percent * (max - min)
    }, [min, max])

    const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
      if (disabled) return
      e.preventDefault()
      setDraggingIndex(index)
    }

    React.useEffect(() => {
      if (draggingIndex === null || disabled) return

      const handleMouseMove = (e: MouseEvent) => {
        const newVal = getValueFromPosition(e.clientX)
        const newValues = [...currentValue]
        newValues[draggingIndex] = newVal
        updateValue(newValues)
      }

      const handleMouseUp = () => {
        setDraggingIndex(null)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }, [draggingIndex, disabled, currentValue, getValueFromPosition, updateValue])

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || e.target !== trackRef.current) return
      const newVal = getValueFromPosition(e.clientX)

      if (currentValue.length === 1) {
        updateValue([newVal])
      } else {
        // Find closest thumb
        let closestIndex = 0
        let closestDist = Math.abs(newVal - currentValue[0])
        for (let i = 1; i < currentValue.length; i++) {
          const dist = Math.abs(newVal - currentValue[i])
          if (dist < closestDist) {
            closestDist = dist
            closestIndex = i
          }
        }
        const newValues = [...currentValue]
        newValues[closestIndex] = newVal
        updateValue(newValues)
      }
    }

    const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
      if (disabled) return
      let newVal = currentValue[index]

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        newVal = Math.min(max, newVal + step)
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        newVal = Math.max(min, newVal - step)
      } else if (e.key === "Home") {
        e.preventDefault()
        newVal = min
      } else if (e.key === "End") {
        e.preventDefault()
        newVal = max
      } else {
        return
      }

      const newValues = [...currentValue]
      newValues[index] = newVal
      updateValue(newValues)
    }

    // Calculate range fill
    const percentages = currentValue.map(v => ((v - min) / (max - min)) * 100)
    const rangeStart = currentValue.length === 1 ? 0 : Math.min(...percentages)
    const rangeEnd = currentValue.length === 1 ? percentages[0] : Math.max(...percentages)

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-full bg-primary"
            style={{
              left: `${rangeStart}%`,
              right: `${100 - rangeEnd}%`,
            }}
          />
        </div>

        {currentValue.map((val, index) => (
          <div
            key={index}
            className={cn(
              "absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
              draggingIndex === index ? "scale-110 cursor-grabbing" : "cursor-grab",
              disabled && "cursor-not-allowed"
            )}
            style={{
              left: `calc(${percentages[index]}% - 10px)`,
            }}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={val}
            tabIndex={disabled ? -1 : 0}
            onMouseDown={handleMouseDown(index)}
            onKeyDown={handleKeyDown(index)}
          />
        ))}
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
