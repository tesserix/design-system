import * as React from "react"

import { cn } from "../../lib/utils"

export interface InlineEditableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
}

const InlineEditable = React.forwardRef<HTMLDivElement, InlineEditableProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      placeholder = "Click to edit",
      label = "Inline editable field",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [draftValue, setDraftValue] = React.useState(defaultValue)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : draftValue

    React.useEffect(() => {
      if (isEditing) {
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }, [isEditing])

    const commitValue = () => {
      if (!isControlled) {
        setDraftValue(currentValue)
      }
      onValueChange?.(currentValue)
      setIsEditing(false)
    }

    const cancelEdit = () => {
      if (!isControlled) {
        setDraftValue(defaultValue)
      }
      setIsEditing(false)
    }

    return (
      <div ref={ref} className={cn("inline-flex min-w-[220px] items-center gap-2", className)} {...props}>
        {isEditing ? (
          <>
            <input
              ref={inputRef}
              aria-label={label}
              type="text"
              value={currentValue}
              onChange={(event) => {
                if (!isControlled) {
                  setDraftValue(event.target.value)
                }
                onValueChange?.(event.target.value)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  commitValue()
                }
                if (event.key === "Escape") {
                  event.preventDefault()
                  cancelEdit()
                }
              }}
              onBlur={commitValue}
              className={cn(
                "h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            />
            <button
              type="button"
              aria-label="Save value"
              onMouseDown={(event) => event.preventDefault()}
              onClick={commitValue}
              className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-accent"
            >
              Save
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={disabled}
            aria-label={label}
            onClick={() => {
              if (!disabled) setIsEditing(true)
            }}
            className={cn(
              "inline-flex h-9 flex-1 items-center rounded-md border border-transparent px-3 text-left text-sm transition-colors",
              currentValue ? "text-foreground hover:bg-accent" : "text-muted-foreground hover:bg-accent/60",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            {currentValue || placeholder}
          </button>
        )}
      </div>
    )
  }
)
InlineEditable.displayName = "InlineEditable"

export { InlineEditable }
