import * as React from "react"

import { cn } from "../../lib/utils"

export interface SearchBarProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  value?: string
  defaultValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
  onSearch?: (value: string) => void
  buttonLabel?: string
}

const SearchBar = React.forwardRef<HTMLFormElement, SearchBarProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = "",
      placeholder = "Search...",
      onValueChange,
      onSearch,
      buttonLabel = "Search",
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue)

    const value = isControlled ? controlledValue : internalValue

    const setValue = (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    }

    return (
      <form
        ref={ref}
        onSubmit={(event) => {
          event.preventDefault()
          onSearch?.(value)
        }}
        className={cn("flex w-full items-center gap-2", className)}
        {...props}
      >
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex h-11 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
          )}
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {buttonLabel}
        </button>
      </form>
    )
  }
)
SearchBar.displayName = "SearchBar"

export { SearchBar }
