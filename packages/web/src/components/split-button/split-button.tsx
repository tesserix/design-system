import * as React from "react"

import { cn } from "../../lib/utils"

export interface SplitButtonOption {
  id: string
  label: string
  disabled?: boolean
}

export interface SplitButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  primaryLabel: string
  options: SplitButtonOption[]
  onPrimaryClick?: () => void
  onOptionSelect?: (optionId: string) => void
  disabled?: boolean
}

const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  ({
    className,
    primaryLabel,
    options,
    onPrimaryClick,
    onOptionSelect,
    disabled = false,
    ...props
  }, ref) => {
    const [open, setOpen] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
      const onPointerDown = (event: MouseEvent) => {
        if (!rootRef.current) return
        if (!rootRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      const onEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", onPointerDown)
      document.addEventListener("keydown", onEscape)
      return () => {
        document.removeEventListener("mousedown", onPointerDown)
        document.removeEventListener("keydown", onEscape)
      }
    }, [])

    return (
      <div
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        className={cn("relative inline-flex", className)}
        {...props}
      >
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center rounded-l-md border border-input bg-primary px-4 text-sm font-medium text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
          onClick={onPrimaryClick}
          disabled={disabled}
        >
          {primaryLabel}
        </button>

        <button
          type="button"
          aria-label="Open actions"
          aria-expanded={open}
          aria-haspopup="menu"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-input bg-primary text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
          onClick={() => setOpen((current) => !current)}
          disabled={disabled || options.length === 0}
        >
          ▾
        </button>

        {open ? (
          <ul
            role="menu"
            className="absolute right-0 top-11 z-10 min-w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          >
            {options.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  role="menuitem"
                  disabled={option.disabled}
                  className={cn(
                    "flex w-full items-center rounded-sm px-2 py-1.5 text-left text-sm",
                    "hover:bg-accent hover:text-accent-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  onClick={() => {
                    if (option.disabled) return
                    onOptionSelect?.(option.id)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }
)
SplitButton.displayName = "SplitButton"

export { SplitButton }
