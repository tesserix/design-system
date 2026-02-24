import * as React from "react"

import { cn } from "../../lib/utils"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  options: ComboboxOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
}

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      className,
      options,
      value: controlledValue,
      defaultValue,
      onValueChange,
      placeholder = "Select an option...",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      disabled = false,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listId = React.useId()
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")

    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement)

    const isControlled = controlledValue !== undefined
    const selectedValue = isControlled ? controlledValue : uncontrolledValue
    const selectedOption = options.find((option) => option.value === selectedValue)

    const filteredOptions = React.useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase()
      if (!normalizedQuery) {
        return options
      }

      return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
    }, [options, query])

    React.useEffect(() => {
      if (!open) {
        setHighlightedIndex(0)
      }
    }, [open])

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (!rootRef.current) return
        if (!rootRef.current.contains(event.target as Node)) {
          setOpen(false)
          setQuery("")
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectOption = React.useCallback(
      (option: ComboboxOption) => {
        if (option.disabled) return

        if (!isControlled) {
          setUncontrolledValue(option.value)
        }
        onValueChange?.(option.value)
        setOpen(false)
        setQuery("")
        inputRef.current?.blur()
      },
      [isControlled, onValueChange]
    )

    const displayValue = open ? query : selectedOption?.label ?? ""
    const activeOption = filteredOptions[highlightedIndex]

    return (
      <div ref={rootRef} className={cn("relative w-full", className)} {...props}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label={ariaLabel ?? "Combobox input"}
          aria-labelledby={ariaLabelledBy}
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && activeOption ? `${listId}-${activeOption.value}` : undefined}
          aria-autocomplete="list"
          disabled={disabled}
          placeholder={open ? searchPlaceholder : selectedOption ? undefined : placeholder}
          value={displayValue}
          onFocus={() => {
            if (!disabled) {
              setOpen(true)
              setQuery("")
            }
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setHighlightedIndex(0)
          }}
          onKeyDown={(event) => {
            if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
              setOpen(true)
              return
            }

            if (!open) return

            if (event.key === "ArrowDown") {
              event.preventDefault()
              setHighlightedIndex((index) => (index + 1) % Math.max(filteredOptions.length, 1))
              return
            }

            if (event.key === "ArrowUp") {
              event.preventDefault()
              setHighlightedIndex((index) => (index - 1 + Math.max(filteredOptions.length, 1)) % Math.max(filteredOptions.length, 1))
              return
            }

            if (event.key === "Enter") {
              event.preventDefault()
              if (activeOption) {
                selectOption(activeOption)
              }
              return
            }

            if (event.key === "Escape") {
              event.preventDefault()
              setOpen(false)
              setQuery("")
            }
          }}
          className={cn(
            "flex h-11 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />

        {open ? (
          <div
            id={listId}
            role="listbox"
            className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-foreground/80">{emptyText}</div>
            ) : (
              filteredOptions.map((option, index) => {
                const selected = option.value === selectedValue
                const highlighted = index === highlightedIndex

                return (
                  <button
                    key={option.value}
                    id={`${listId}-${option.value}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={option.disabled}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                      highlighted ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                      selected && "font-semibold",
                      option.disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <span>{option.label}</span>
                    {selected ? (
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
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : null}
                  </button>
                )
              })
            )}
          </div>
        ) : null}
      </div>
    )
  }
)
Combobox.displayName = "Combobox"

export { Combobox }
