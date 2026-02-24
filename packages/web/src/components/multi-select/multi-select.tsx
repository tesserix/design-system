import * as React from "react"

import { cn } from "../../lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      options,
      value: controlledValue,
      defaultValue = [],
      onValueChange,
      placeholder = "Select options...",
      emptyText = "No options available",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string[]>(defaultValue)

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement)

    const selectedValues = controlledValue ?? uncontrolledValue

    const filteredOptions = React.useMemo(() => {
      const normalized = query.trim().toLowerCase()
      if (!normalized) {
        return options
      }

      return options.filter((option) => option.label.toLowerCase().includes(normalized))
    }, [options, query])

    React.useEffect(() => {
      const onPointerDown = (event: MouseEvent) => {
        if (!rootRef.current?.contains(event.target as Node)) {
          setOpen(false)
          setQuery("")
        }
      }

      document.addEventListener("mousedown", onPointerDown)
      return () => document.removeEventListener("mousedown", onPointerDown)
    }, [])

    const setSelectedValues = React.useCallback(
      (nextValues: string[]) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(nextValues)
        }
        onValueChange?.(nextValues)
      },
      [controlledValue, onValueChange]
    )

    const toggleValue = React.useCallback(
      (optionValue: string) => {
        const nextValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((value) => value !== optionValue)
          : [...selectedValues, optionValue]

        setSelectedValues(nextValues)
      },
      [selectedValues, setSelectedValues]
    )

    const selectedLabels = options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label)

    return (
      <div ref={rootRef} className={cn("relative w-full min-w-0", className)} {...props}>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => {
            if (!disabled) {
              setOpen((current) => !current)
            }
          }}
          className={cn(
            "flex h-11 w-full min-w-0 items-center justify-between rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <span className={cn("flex-1 truncate text-left", selectedLabels.length === 0 && "text-muted-foreground")}>
            {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
          </span>
          <span className="ml-2 w-6 text-right text-xs text-muted-foreground">{selectedValues.length}</span>
        </button>

        {open ? (
          <div className="absolute left-0 right-0 z-50 mt-2 min-w-full rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search options..."
              className="mb-2 h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            <div role="listbox" className="max-h-56 space-y-1 overflow-auto">
              {filteredOptions.length === 0 ? (
                <p className="px-2 py-1.5 text-sm text-muted-foreground">{emptyText}</p>
              ) : (
                filteredOptions.map((option) => {
                  const checked = selectedValues.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={checked}
                      disabled={option.disabled}
                      onClick={() => toggleValue(option.value)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                        "hover:bg-accent hover:text-accent-foreground",
                        option.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        tabIndex={-1}
                        className="h-4 w-4 rounded border-input"
                      />
                      <span>{option.label}</span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        ) : null}
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
