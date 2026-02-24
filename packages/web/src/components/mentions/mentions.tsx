import * as React from "react"

import { cn } from "../../lib/utils"

export interface MentionOption {
  id: string
  label: string
}

export interface MentionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: MentionOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onMentionSelect?: (option: MentionOption) => void
  placeholder?: string
}

const Mentions = React.forwardRef<HTMLDivElement, MentionsProps>(
  (
    {
      className,
      options,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      onMentionSelect,
      placeholder = "Type @ to mention...",
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")

    const value = controlledValue ?? internalValue

    const setValue = (nextValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    }

    const filtered = React.useMemo(() => {
      if (!query) return options
      const lower = query.toLowerCase()
      return options.filter((option) => option.label.toLowerCase().includes(lower))
    }, [options, query])

    const updateMentionState = (nextValue: string) => {
      const lastAt = nextValue.lastIndexOf("@")
      if (lastAt < 0) {
        setOpen(false)
        setQuery("")
        return
      }

      const activeQuery = nextValue.slice(lastAt + 1)
      if (activeQuery.includes(" ")) {
        setOpen(false)
        setQuery("")
        return
      }

      setOpen(true)
      setQuery(activeQuery)
    }

    const applyMention = (option: MentionOption) => {
      const lastAt = value.lastIndexOf("@")
      if (lastAt < 0) return

      const prefix = value.slice(0, lastAt)
      const nextValue = `${prefix}@${option.label} `
      setValue(nextValue)
      onMentionSelect?.(option)
      setOpen(false)
      setQuery("")
    }

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <textarea
          value={value}
          onChange={(event) => {
            const next = event.target.value
            setValue(next)
            updateMentionState(next)
          }}
          placeholder={placeholder}
          className="min-h-28 w-full rounded-xl border-2 border-input bg-background p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
        />

        {open ? (
          <div className="absolute left-0 right-0 z-50 mt-2 max-h-52 overflow-auto rounded-lg border bg-popover p-1 shadow-lg">
            {filtered.map((option) => (
              <button
                key={option.id}
                type="button"
                className="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => applyMention(option)}
              >
                {option.label}
              </button>
            ))}
            {filtered.length === 0 ? <p className="px-3 py-2 text-sm text-muted-foreground">No matches</p> : null}
          </div>
        ) : null}
      </div>
    )
  }
)
Mentions.displayName = "Mentions"

export { Mentions }
