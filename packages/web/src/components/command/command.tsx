import * as React from "react"

import { cn } from "../../lib/utils"
import { Dialog, DialogContent } from "../dialog"
import type { DialogProps } from "../dialog/dialog"

interface RegisteredItem {
  disabled: boolean
  element: HTMLElement | null
}

interface CommandContextValue {
  query: string
  setQuery: (query: string) => void
  shouldFilter: boolean
  activeValue?: string
  setActiveValue: (value?: string) => void
  value?: string
  onValueChange?: (value: string) => void
  registerItem: (value: string, item: RegisteredItem) => void
  unregisterItem: (value: string) => void
  getSelectableValues: () => string[]
  renderedCount: number
  listId: string
  listMounted: boolean
  setListMounted: (mounted: boolean) => void
  getItemId: (value: string) => string
}

const CommandContext = React.createContext<CommandContextValue | undefined>(undefined)

const useCommand = () => {
  const context = React.useContext(CommandContext)
  if (!context) {
    throw new Error("Command components must be used within Command")
  }
  return context
}

/** Orders two registered items by their position in the document. */
const compareDocumentOrder = (a: HTMLElement | null, b: HTMLElement | null) => {
  if (!a || !b || a === b) return 0
  const position = a.compareDocumentPosition(b)
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
  return 0
}

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The selected item's value. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** The search text. Distinct from `value`, which is the selected item. */
  query?: string
  defaultQuery?: string
  onQueryChange?: (query: string) => void
  /** Set false when a caller filters results itself (e.g. server-side search). */
  shouldFilter?: boolean
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      query: controlledQuery,
      defaultQuery = "",
      onQueryChange,
      shouldFilter = true,
      onKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    const baseId = React.useId()
    const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultQuery)
    const [activeValue, setActiveValue] = React.useState<string | undefined>(undefined)
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const [listMounted, setListMounted] = React.useState(false)

    // The registry is state, not a ref: CommandEmpty and the highlight both
    // depend on it, and a ref would leave them rendering stale data (#8, #11).
    const [items, setItems] = React.useState<ReadonlyMap<string, RegisteredItem>>(() => new Map())
    const itemIdsRef = React.useRef<Map<string, string>>(new Map())

    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
    const query = controlledQuery !== undefined ? controlledQuery : uncontrolledQuery

    const setQuery = React.useCallback(
      (nextQuery: string) => {
        if (controlledQuery === undefined) {
          setUncontrolledQuery(nextQuery)
        }
        onQueryChange?.(nextQuery)
      },
      [controlledQuery, onQueryChange]
    )

    const registerItem = React.useCallback((itemValue: string, item: RegisteredItem) => {
      setItems((previous) => {
        const existing = previous.get(itemValue)
        if (existing && existing.disabled === item.disabled && existing.element === item.element) {
          return previous
        }
        const next = new Map(previous)
        next.set(itemValue, item)
        return next
      })
    }, [])

    const unregisterItem = React.useCallback((itemValue: string) => {
      setItems((previous) => {
        if (!previous.has(itemValue)) return previous
        const next = new Map(previous)
        next.delete(itemValue)
        return next
      })
    }, [])

    const getSelectableValues = React.useCallback(
      () =>
        [...items.entries()]
          .filter(([, item]) => !item.disabled)
          .sort(([, a], [, b]) => compareDocumentOrder(a.element, b.element))
          .map(([itemValue]) => itemValue),
      [items]
    )

    const getItemId = React.useCallback(
      (itemValue: string) => {
        const existing = itemIdsRef.current.get(itemValue)
        if (existing) return existing
        const nextId = `${baseId}-item-${itemIdsRef.current.size}`
        itemIdsRef.current.set(itemValue, nextId)
        return nextId
      },
      [baseId]
    )

    const selectValue = React.useCallback(
      (nextValue: string) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(nextValue)
        }
        onValueChange?.(nextValue)
      },
      [controlledValue, onValueChange]
    )

    // Keep the highlight inside the current match set. Items register in an
    // effect, so this must run after them — child effects flush first, which is
    // why a stale `activeValue` can never survive a keystroke (#11).
    React.useEffect(() => {
      if (activeValue === undefined) return
      const selectable = getSelectableValues()
      if (!selectable.includes(activeValue)) {
        setActiveValue(selectable[0])
      }
    }, [activeValue, getSelectableValues])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const selectable = getSelectableValues()

      if (event.key === "ArrowDown") {
        event.preventDefault()
        if (selectable.length === 0) return
        const currentIndex = selectable.indexOf(activeValue ?? "")
        setActiveValue(selectable[(currentIndex + 1) % selectable.length])
        return
      }

      if (event.key === "ArrowUp") {
        event.preventDefault()
        if (selectable.length === 0) return
        const currentIndex = Math.max(selectable.indexOf(activeValue ?? ""), 0)
        setActiveValue(selectable[(currentIndex - 1 + selectable.length) % selectable.length])
        return
      }

      if (event.key === "Enter") {
        event.preventDefault()
        // Confirm the highlight is still on screen before acting on it (#11).
        if (activeValue && selectable.includes(activeValue)) {
          selectValue(activeValue)
        }
      }

      onKeyDown?.(event)
    }

    const contextValue = React.useMemo<CommandContextValue>(
      () => ({
        query,
        setQuery,
        shouldFilter,
        activeValue,
        setActiveValue,
        value,
        onValueChange: selectValue,
        registerItem,
        unregisterItem,
        getSelectableValues,
        renderedCount: items.size,
        listId: `${baseId}-list`,
        listMounted,
        setListMounted,
        getItemId,
      }),
      [
        query,
        setQuery,
        shouldFilter,
        activeValue,
        value,
        selectValue,
        registerItem,
        unregisterItem,
        getSelectableValues,
        items,
        baseId,
        listMounted,
        getItemId,
      ]
    )

    return (
      <CommandContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md",
            className
          )}
          // Handled here rather than on CommandList so keystrokes from the
          // input — a sibling of the list — still reach it (#7).
          onKeyDown={handleKeyDown}
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
    const { query, setQuery, activeValue, listId, listMounted, getItemId } = useCommand()

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
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={listMounted}
          aria-autocomplete="list"
          aria-controls={listMounted ? listId : undefined}
          aria-activedescendant={activeValue ? getItemId(activeValue) : undefined}
          {...props}
        />
      </div>
    )
  }
)
CommandInput.displayName = "CommandInput"

const CommandList = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const { listId, setListMounted } = useCommand()

    React.useEffect(() => {
      setListMounted(true)
      return () => setListMounted(false)
    }, [setListMounted])

    return (
      <div
        ref={ref}
        id={listId}
        role="listbox"
        tabIndex={0}
        className={cn("max-h-[320px] overflow-y-auto overflow-x-hidden p-2", className)}
        {...props}
      />
    )
  }
)
CommandList.displayName = "CommandList"

const CommandEmpty = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    // Empty means "nothing rendered", not "nothing selectable" — a list of
    // disabled matches is not empty (#8).
    const { renderedCount } = useCommand()
    if (renderedCount > 0) return null

    return <div ref={ref} className={cn("py-6 text-center text-sm text-muted-foreground", className)} {...props} />
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
    const {
      query,
      shouldFilter,
      activeValue,
      setActiveValue,
      onValueChange,
      value: selectedValue,
      registerItem,
      unregisterItem,
      getItemId,
    } = useCommand()

    const innerRef = React.useRef<HTMLButtonElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const matchesQuery =
      !shouldFilter || [value, ...keywords].join(" ").toLowerCase().includes(query.toLowerCase().trim())

    // Disabled items register too — they are on screen, so they count against
    // emptiness even though they cannot be selected (#8).
    React.useEffect(() => {
      if (!matchesQuery) return
      registerItem(value, { disabled: Boolean(disabled), element: innerRef.current })
      return () => unregisterItem(value)
    }, [matchesQuery, disabled, value, registerItem, unregisterItem])

    if (!matchesQuery) return null

    const isActive = activeValue === value
    const isSelected = selectedValue === value

    return (
      <button
        ref={setRefs}
        id={getItemId(value)}
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

const CommandLoading = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children = "Searching…", ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
)
CommandLoading.displayName = "CommandLoading"

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
  CommandLoading,
  CommandShortcut,
  CommandSeparator,
  CommandDialog,
}
