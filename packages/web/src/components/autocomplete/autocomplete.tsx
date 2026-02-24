import * as React from "react"

import { cn } from "../../lib/utils"

export interface AutocompleteOption {
  value: string
  label: string
  keywords?: string[]
}

export interface AutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  options: AutocompleteOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOptionSelect?: (option: AutocompleteOption) => void
  emptyText?: string
  maxResults?: number
}

const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      onOptionSelect,
      emptyText = "No matches found.",
      maxResults = 8,
      className,
      disabled,
      placeholder = "Search...",
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listId = React.useId()

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [open, setOpen] = React.useState(false)
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)

    const inputValue = isControlled ? controlledValue : internalValue

    const setValue = React.useCallback(
      (nextValue: string) => {
        if (!isControlled) {
          setInternalValue(nextValue)
        }
        onValueChange?.(nextValue)
      },
      [isControlled, onValueChange]
    )

    const filteredOptions = React.useMemo(() => {
      const query = inputValue.trim().toLowerCase()
      const source = query
        ? options.filter((option) => {
            if (option.label.toLowerCase().includes(query)) {
              return true
            }

            return option.keywords?.some((keyword) => keyword.toLowerCase().includes(query)) ?? false
          })
        : options

      return source.slice(0, maxResults)
    }, [inputValue, maxResults, options])

    React.useEffect(() => {
      const onDocumentClick = (event: MouseEvent) => {
        if (rootRef.current?.contains(event.target as Node)) {
          return
        }

        setOpen(false)
      }

      document.addEventListener("mousedown", onDocumentClick)
      return () => document.removeEventListener("mousedown", onDocumentClick)
    }, [])

    React.useEffect(() => {
      setHighlightedIndex(0)
    }, [inputValue])

    const selectOption = React.useCallback(
      (option: AutocompleteOption) => {
        setValue(option.label)
        onOptionSelect?.(option)
        setOpen(false)
        inputRef.current?.focus()
      },
      [onOptionSelect, setValue]
    )

    const activeOption = filteredOptions[highlightedIndex]

    return (
      <div ref={rootRef} className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && activeOption ? `${listId}-${activeOption.value}` : undefined}
          aria-autocomplete="list"
          className={cn(
            "flex h-11 w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm shadow-sm transition-all duration-200",
            "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
          value={inputValue}
          onFocus={() => {
            if (!disabled) {
              setOpen(true)
            }
          }}
          onChange={(event) => {
            setValue(event.target.value)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
              setOpen(true)
              return
            }

            if (!open) {
              return
            }

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
              if (activeOption) {
                event.preventDefault()
                selectOption(activeOption)
              }
              return
            }

            if (event.key === "Escape") {
              setOpen(false)
            }
          }}
          {...props}
        />

        {open ? (
          <div
            id={listId}
            role="listbox"
            className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">{emptyText}</div>
            ) : (
              filteredOptions.map((option, index) => {
                const isActive = index === highlightedIndex

                return (
                  <button
                    key={option.value}
                    id={`${listId}-${option.value}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => selectOption(option)}
                    className={cn(
                      "flex w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                    )}
                  >
                    {option.label}
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
Autocomplete.displayName = "Autocomplete"

export { Autocomplete }
