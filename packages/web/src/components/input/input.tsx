import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  isValid?: boolean
  isInvalid?: boolean
  helperText?: string
  errorText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isValid, isInvalid, helperText, errorText, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const helperId = `${inputId}-helper`
    const errorId = `${inputId}-error`
    const showError = isInvalid && errorText
    const showHelper = helperText && !showError

    const input = (
      <input
        id={inputId}
        type={type}
        aria-invalid={isInvalid || undefined}
        aria-describedby={showError ? errorId : showHelper ? helperId : undefined}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isValid && "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20",
          isInvalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          (isValid || isInvalid) && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )

    if (!isValid && !isInvalid && !helperText && !errorText) {
      return input
    }

    return (
      <div className="relative w-full">
        <div className="relative">
          {input}
          {isValid && !isInvalid && (
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
          {isInvalid && (
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          )}
        </div>
        {showError && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-destructive">
            {errorText}
          </p>
        )}
        {showHelper && (
          <p id={helperId} className="mt-1.5 text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export interface FloatingInputProps extends React.ComponentProps<"input"> {
  label: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="relative">
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer h-12 w-full rounded-lg border-2 border-input bg-transparent px-4 pt-5 pb-2 text-base outline-none",
            "transition-all duration-200 ease-out",
            "placeholder-shown:pt-3.5",
            "focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
            "transition-all duration-200 ease-out origin-left",
            "peer-focus-visible:top-3 peer-focus-visible:text-xs peer-focus-visible:text-ring peer-focus-visible:font-medium",
            "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium",
            "peer-aria-invalid:text-destructive"
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { Input, FloatingInput }
