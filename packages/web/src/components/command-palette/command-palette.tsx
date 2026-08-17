import * as React from "react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "../command"

export interface CommandPaletteItem {
  id: string
  label: string
  group?: string
  keywords?: string[]
  onSelect?: () => void
}

export interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CommandPaletteItem[]
  placeholder?: string
  emptyText?: string
  /** The search text. Supply with `onQueryChange` to drive server-side search. */
  query?: string
  onQueryChange?: (query: string) => void
  /** Renders a stable row instead of the list while results are in flight. */
  loading?: boolean
  /** Set false when results are already filtered by the caller. */
  shouldFilter?: boolean
  loadingText?: string
}

const CommandPalette = ({
  open,
  onOpenChange,
  items,
  placeholder = "Search commands...",
  emptyText = "No matching commands.",
  query,
  onQueryChange,
  loading = false,
  shouldFilter = true,
  loadingText = "Searching…",
}: CommandPaletteProps) => {
  const grouped = React.useMemo(() => {
    return items.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
      const key = item.group ?? "Commands"
      acc[key] = acc[key] ? [...acc[key], item] : [item]
      return acc
    }, {})
  }, [items])

  const selectItem = React.useCallback(
    (id: string) => {
      items.find((item) => item.id === id)?.onSelect?.()
      onOpenChange(false)
    },
    [items, onOpenChange]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command
        query={query}
        onQueryChange={onQueryChange}
        shouldFilter={shouldFilter}
        // Routes both Enter-to-select and click through one path (#7, #10).
        onValueChange={selectItem}
      >
        <CommandInput placeholder={placeholder} />
        <CommandList>
          {loading ? <CommandLoading>{loadingText}</CommandLoading> : <CommandEmpty>{emptyText}</CommandEmpty>}
          {Object.entries(grouped).map(([group, groupItems]) => (
            <CommandGroup key={group}>
              <p data-command-group-heading="">{group}</p>
              {groupItems.map((item) => (
                <CommandItem key={item.id} value={item.id} keywords={[item.label, ...(item.keywords ?? [])]}>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export { CommandPalette }
