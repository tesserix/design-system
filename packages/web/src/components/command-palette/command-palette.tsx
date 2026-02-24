import * as React from "react"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
}

const CommandPalette = ({
  open,
  onOpenChange,
  items,
  placeholder = "Search commands...",
  emptyText = "No matching commands.",
}: CommandPaletteProps) => {
  const grouped = React.useMemo(() => {
    return items.reduce<Record<string, CommandPaletteItem[]>>((acc, item) => {
      const key = item.group ?? "Commands"
      acc[key] = acc[key] ? [...acc[key], item] : [item]
      return acc
    }, {})
  }, [items])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>{emptyText}</CommandEmpty>
          {Object.entries(grouped).map(([group, groupItems]) => (
            <CommandGroup key={group}>
              <p data-command-group-heading="">{group}</p>
              {groupItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  keywords={[item.label, ...(item.keywords ?? [])]}
                  onClick={() => {
                    item.onSelect?.()
                    onOpenChange(false)
                  }}
                >
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
