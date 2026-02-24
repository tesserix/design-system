import * as React from "react"

import { cn } from "../../lib/utils"
import { Dialog, DialogContent } from "../dialog"
import type { DialogProps } from "../dialog/dialog"

interface CommandContextValue {
  query: string
  setQuery: (query: string) => void
  activeValue?: string
  setActiveValue: (value?: string) => void
  value?: string
  onValueChange?: (value: string) => void
  registerVisibleItem: (value: string) => void
  unregisterVisibleItem: (value: string) => void
  getVisibleItems: () => string[]
}

const CommandContext = React.createContext<CommandContextValue | undefined>(undefined)

const useCommand = () => {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error("Command components must be used within Command")
  }
  return context
}

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, value: controlledValue, defaultValue, onValueChange, children, ...props }, ref) => {
    const [query, setQuery] = React.useState("")
    const [activeValue, setActiveValue] = React.useState<string | undefined>(undefined)
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const visibleItemsRef = React.useRef<string[]>([])

    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue

    const registerVisibleItem = React.useCallback((itemValue: string) => {
      if (!visibleItemsRef.current.includes(itemValue)) {
        visibleItemsRef.current = [...visibleItemsRef.current, itemValue]
      }
    }, [])

    const unregisterVisibleItem = React.useCallback((itemValue: string) => {
      visibleItemsRef.current = visibleItemsRef.current.filter((valueItem) => valueItem !== itemValue)
    }, [])

    const getVisibleItems = React.useCallback(() => visibleItemsRef.current, [])

    const contextValue = React.useMemo(
      () => ({
        query,
        setQuery,
        activeValue,
        setActiveValue,
        value,
        onValueChange: (nextValue: string) => {
          if (controlledValue === undefined) {
            setUncontrolledValue(nextValue)
          }
          onValueChange?.(nextValue)
        },
        registerVisibleItem,
        unregisterVisibleItem,
        getVisibleItems,
      }),
      [query, activeValue, value, controlledValue, onValueChange, registerVisibleItem, unregisterVisibleItem, getVisibleItems]
    )

    return (
      <CommandContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CommandContext.Provider>
    )
  }
)
Command.displayName = "Command"

const CommandInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, placeholder = "Type a command or search...", ...props }, ref) => {
    const { query, setQuery, setActiveValue, getVisibleItems } = useCommand()

    return (
      <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
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
          className="mr-2 h-4 w-4 shrink-0 opacity-50"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            const firstVisibleItem = getVisibleItems()[0]
            setActiveValue(firstVisibleItem)
          }}
          placeholder={placeholder}
          {...props}
        />
      </div>
    )
  }
)
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, onKeyDown, ...props }, ref) => {
    const { activeValue, setActiveValue, getVisibleItems, onValueChange } = useCommand()

    return (
      <div
        ref={ref}
        role="listbox"
        tabIndex={0}
        className={cn("max-h-[320px] overflow-y-auto overflow-x-hidden p-2", className)}
        onKeyDown={(event) => {
          const visibleItems = getVisibleItems()

          if (event.key === "ArrowDown") {
            event.preventDefault()
            if (visibleItems.length === 0) return
            const currentIndex = Math.max(visibleItems.indexOf(activeValue ?? ""), -1)
            const nextValue = visibleItems[(currentIndex + 1) % visibleItems.length]
            setActiveValue(nextValue)
            return
          }

          if (event.key === "ArrowUp") {
            event.preventDefault()
            if (visibleItems.length === 0) return
            const currentIndex = Math.max(visibleItems.indexOf(activeValue ?? ""), 0)
            const previousValue = visibleItems[(currentIndex - 1 + visibleItems.length) % visibleItems.length]
            setActiveValue(previousValue)
            return
          }

          if (event.key === "Enter") {
            event.preventDefault()
            if (activeValue) {
              onValueChange?.(activeValue)
            }
          }

          onKeyDown?.(event)
        }}
        {...props}
      />
    )
  }
)
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const { getVisibleItems } = useCommand()
    if (getVisibleItems().length > 0) return null

    return (
      <div ref={ref} className={cn("py-6 text-center text-sm text-muted-foreground", className)} {...props} />
    )
  }
)
CommandEmpty.displayName = "CommandEmpty"

const CommandGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[data-command-group-heading]]:px-2 [&_[data-command-group-heading]]:py-1.5 [&_[data-command-group-heading]]:text-xs [&_[data-command-group-heading]]:font-medium [&_[data-command-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
CommandGroup.displayName = "CommandGroup"

const CommandSeparator = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
)
CommandSeparator.displayName = "CommandSeparator"

export interface CommandItemProps extends React.ComponentProps<"button"> {
  value: string
  keywords?: string[]
}

const CommandItem = React.forwardRef<HTMLButtonElement, CommandItemProps>(
  ({ className, value, keywords = [], onClick, children, disabled, ...props }, ref) => {
    const { query, activeValue, setActiveValue, onValueChange, value: selectedValue, registerVisibleItem, unregisterVisibleItem } = useCommand()

    const matchesQuery = [value, ...keywords].join(" ").toLowerCase().includes(query.toLowerCase().trim())

    React.useEffect(() => {
      if (!matchesQuery || disabled) return
      registerVisibleItem(value)
      return () => unregisterVisibleItem(value)
    }, [matchesQuery, disabled, value, registerVisibleItem, unregisterVisibleItem])

    if (!matchesQuery) return null

    const isActive = activeValue === value
    const isSelected = selectedValue === value

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={isSelected}
        disabled={disabled}
        data-active={isActive ? "true" : "false"}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none transition-colors",
          "data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onMouseEnter={() => setActiveValue(value)}
        onClick={(event) => {
          onValueChange?.(value)
          onClick?.(event)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CommandItem.displayName = "CommandItem"

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-widest text-foreground/80", className)} {...props} />
)
CommandShortcut.displayName = "CommandShortcut"

interface CommandDialogProps extends DialogProps {
  children: React.ReactNode
  contentClassName?: string
}

const CommandDialog = ({ children, contentClassName, ...props }: CommandDialogProps) => (
  <Dialog {...props}>
    <DialogContent className={cn("overflow-hidden p-0", contentClassName)} size="lg">
      {children}
    </DialogContent>
  </Dialog>
)
CommandDialog.displayName = "CommandDialog"

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandDialog,
}
