import * as React from "react"

import { cn } from "../../lib/utils"

export interface OTPInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  length?: number
  disabled?: boolean
  placeholderChar?: string
}

const normalizeValue = (value: string, length: number) =>
  value.replace(/\D/g, "").slice(0, length)

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      length = 6,
      disabled = false,
      placeholderChar = "•",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(normalizeValue(defaultValue, length))
    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

    const isControlled = controlledValue !== undefined
    const value = normalizeValue(isControlled ? controlledValue : internalValue, length)
    const chars = Array.from({ length }, (_, index) => value[index] ?? "")

    const updateValue = React.useCallback(
      (next: string) => {
        const normalized = normalizeValue(next, length)
        if (!isControlled) {
          setInternalValue(normalized)
        }
        onValueChange?.(normalized)
      },
      [isControlled, length, onValueChange]
    )

    const focusInput = (index: number) => {
      const node = inputRefs.current[index]
      node?.focus()
      node?.select()
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`One-time password input with ${length} digits`}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(node) => {
              inputRefs.current[index] = node
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            disabled={disabled}
            value={char}
            aria-label={`Digit ${index + 1}`}
            placeholder={placeholderChar}
            className={cn(
              "h-11 w-10 rounded-lg border border-input bg-background text-center text-lg font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            onChange={(event) => {
              const digit = event.target.value.replace(/\D/g, "").slice(-1)
              if (!digit) return

              const nextChars = [...chars]
              nextChars[index] = digit
              updateValue(nextChars.join(""))
              if (index < length - 1) {
                focusInput(index + 1)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                event.preventDefault()
                const nextChars = [...chars]
                if (nextChars[index]) {
                  nextChars[index] = ""
                  updateValue(nextChars.join(""))
                  return
                }
                if (index > 0) {
                  nextChars[index - 1] = ""
                  updateValue(nextChars.join(""))
                  focusInput(index - 1)
                }
                return
              }

              if (event.key === "ArrowLeft" && index > 0) {
                event.preventDefault()
                focusInput(index - 1)
              }
              if (event.key === "ArrowRight" && index < length - 1) {
                event.preventDefault()
                focusInput(index + 1)
              }
            }}
            onPaste={(event) => {
              event.preventDefault()
              const pasted = event.clipboardData.getData("text")
              const digits = normalizeValue(pasted, length)
              if (!digits) return
              updateValue(digits)
              const focusIndex = Math.min(digits.length, length - 1)
              focusInput(focusIndex)
            }}
          />
        ))}
      </div>
    )
  }
)
OTPInput.displayName = "OTPInput"

export { OTPInput }
