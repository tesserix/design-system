"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

// --- Types ---

export interface SidebarSearchItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  /** Breadcrumb path for display, e.g. ["Settings", "General"] */
  breadcrumb?: string[]
  /** Keywords for fuzzy matching beyond the label */
  keywords?: string[]
}

export interface SidebarSearchProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Flat list of searchable items */
  items: SidebarSearchItem[]
  /** Callback when an item is selected */
  onSelect?: (item: SidebarSearchItem) => void
  /** Placeholder text */
  placeholder?: string
  /** Max results to show */
  maxResults?: number
}

// --- Icons ---

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
)

// --- Scoring ---

function scoreMatch(query: string, item: SidebarSearchItem): number {
  const q = query.toLowerCase()
  const label = item.label.toLowerCase()

  // Exact match
  if (label === q) return 100
  // Starts with
  if (label.startsWith(q)) return 80
  // Contains
  if (label.includes(q)) return 60
  // Check breadcrumb
  if (item.breadcrumb) {
    const path = item.breadcrumb.join(" ").toLowerCase()
    if (path.includes(q)) return 40
  }
  // Check keywords
  if (item.keywords) {
    const kw = item.keywords.join(" ").toLowerCase()
    if (kw.includes(q)) return 30
  }
  // Fuzzy: all chars present in order
  let qi = 0
  for (let i = 0; i < label.length && qi < q.length; i++) {
    if (label[i] === q[qi]) qi++
  }
  if (qi === q.length) return 20

  return 0
}

// --- Highlight ---

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-foreground rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// --- SidebarSearch ---

const SidebarSearch = React.forwardRef<HTMLDivElement, SidebarSearchProps>(
  (
    {
      items,
      onSelect,
      placeholder = "Search menu...",
      maxResults = 8,
      className,
      ...props
    },
    ref
  ) => {
    const [query, setQuery] = React.useState("")
    const [activeIndex, setActiveIndex] = React.useState(0)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)

    const results = React.useMemo(() => {
      if (!query.trim()) return []
      return items
        .map((item) => ({ item, score: scoreMatch(query, item) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(({ item }) => item)
    }, [query, items, maxResults])

    // Reset active index when results change
    React.useEffect(() => {
      setActiveIndex(0)
    }, [results.length])

    // Scroll active item into view
    React.useEffect(() => {
      if (!listRef.current) return
      const active = listRef.current.children[activeIndex] as HTMLElement
      active?.scrollIntoView?.({ block: "nearest" })
    }, [activeIndex])

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (results.length === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((i) => (i + 1) % results.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((i) => (i - 1 + results.length) % results.length)
          break
        case "Enter":
          e.preventDefault()
          if (results[activeIndex]) {
            onSelect?.(results[activeIndex])
            setQuery("")
          }
          break
        case "Escape":
          e.preventDefault()
          setQuery("")
          inputRef.current?.blur()
          break
      }
    }

    const handleSelect = (item: SidebarSearchItem) => {
      onSelect?.(item)
      setQuery("")
    }

    const showResults = query.trim().length > 0

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {/* Search input */}
        <div className="relative px-3 py-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full h-8 pl-8 pr-8 text-xs border border-border rounded-md bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 placeholder:text-muted-foreground/60"
              role="combobox"
              aria-expanded={showResults}
              aria-controls="sidebar-search-results"
              aria-activedescendant={
                showResults && results[activeIndex]
                  ? `sidebar-search-${results[activeIndex].id}`
                  : undefined
              }
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  inputRef.current?.focus()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div
            id="sidebar-search-results"
            ref={listRef}
            role="listbox"
            className="border-t border-border bg-background max-h-[240px] overflow-y-auto"
          >
            {results.length === 0 ? (
              <div className="px-4 py-3 text-xs text-muted-foreground text-center">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : (
              results.map((item, i) => (
                <div
                  key={item.id}
                  id={`sidebar-search-${item.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors text-sm",
                    i === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                >
                  {item.icon && (
                    <span className="w-4 h-4 flex-shrink-0 text-muted-foreground">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    {item.breadcrumb && item.breadcrumb.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-0.5">
                        {item.breadcrumb.map((crumb, ci) => (
                          <React.Fragment key={ci}>
                            {ci > 0 && <ChevronRightIcon className="w-2.5 h-2.5" />}
                            <span>{crumb}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                    <span className="text-xs font-medium truncate block">
                      {highlightMatch(item.label, query)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )
  }
)
SidebarSearch.displayName = "SidebarSearch"

export { SidebarSearch }
