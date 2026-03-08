"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// --- Types ---

export interface TenantItem {
  id: string
  name: string
  subtitle?: string
  logoUrl?: string
  color?: string
  role?: string
  isDefault?: boolean
  group?: string
}

export interface TenantSwitcherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** List of available tenants/orgs */
  items: TenantItem[]
  /** Currently selected tenant id */
  selectedId?: string
  /** Callback when a tenant is selected */
  onSelect?: (item: TenantItem) => void
  /** Callback to set a tenant as default */
  onSetDefault?: (item: TenantItem) => void
  /** Callback when "Create new" is clicked */
  onCreateNew?: () => void
  /** Create new button label */
  createNewLabel?: string
  /** Dropdown header title */
  title?: string
  /** Dropdown header description */
  description?: string
  /** Empty state message */
  emptyMessage?: string
  /** Placeholder when nothing selected */
  placeholder?: string
  /** Show search when items exceed this count */
  searchThreshold?: number
  /** Search input placeholder */
  searchPlaceholder?: string
  /** Whether data is loading */
  isLoading?: boolean
  /** Visual variant */
  variant?: "default" | "compact"
  /** Group items by their group property */
  grouped?: boolean
}

// --- Icons (inline SVGs) ---

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6" /></svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6 9 17l-5-5" /></svg>
)

const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
)

const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
)

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
)

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("animate-spin", className)}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
)

// --- TenantAvatar ---

function TenantAvatar({
  item,
  size = "md",
}: {
  item: TenantItem
  size?: "sm" | "md"
}) {
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs rounded-md" : "w-9 h-9 text-sm rounded-lg"

  return (
    <div
      className={cn(
        "flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm",
        sizeClass
      )}
      style={{ backgroundColor: item.color || "#6366f1" }}
    >
      {item.logoUrl ? (
        <img
          src={item.logoUrl}
          alt={item.name}
          className="w-full h-full object-cover rounded-[inherit]"
        />
      ) : (
        item.name.charAt(0).toUpperCase()
      )}
    </div>
  )
}

// --- TenantSwitcher ---

const TenantSwitcher = React.forwardRef<HTMLDivElement, TenantSwitcherProps>(
  (
    {
      items,
      selectedId,
      onSelect,
      onSetDefault,
      onCreateNew,
      createNewLabel = "Create New",
      title = "Switch Workspace",
      description = "Select a workspace to manage",
      emptyMessage = "No workspaces found",
      placeholder = "Select Workspace",
      searchThreshold = 3,
      searchPlaceholder = "Search...",
      isLoading = false,
      variant = "default",
      grouped = false,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [settingDefaultId, setSettingDefaultId] = React.useState<string | null>(null)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const selectedItem = items.find((i) => i.id === selectedId)
    const isCompact = variant === "compact"

    // Close on outside click
    React.useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
          setIsOpen(false)
          setSearchQuery("")
        }
      }
      document.addEventListener("mousedown", handleClick)
      return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // Close on escape
    React.useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false)
          setSearchQuery("")
        }
      }
      document.addEventListener("keydown", handleKey)
      return () => document.removeEventListener("keydown", handleKey)
    }, [])

    // Filter by search
    const filtered = React.useMemo(() => {
      if (!searchQuery) return items
      const q = searchQuery.toLowerCase()
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q))
      )
    }, [items, searchQuery])

    // Group items
    const groups = React.useMemo(() => {
      if (!grouped) return null
      const map = new Map<string, TenantItem[]>()
      for (const item of filtered) {
        const group = item.group || "Other"
        const list = map.get(group) || []
        list.push(item)
        map.set(group, list)
      }
      return map
    }, [filtered, grouped])

    const handleSelect = (item: TenantItem) => {
      onSelect?.(item)
      setIsOpen(false)
      setSearchQuery("")
    }

    const handleSetDefault = async (item: TenantItem, e: React.MouseEvent) => {
      e.stopPropagation()
      if (item.isDefault || !onSetDefault) return
      setSettingDefaultId(item.id)
      onSetDefault(item)
      setSettingDefaultId(null)
    }

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2",
            isCompact ? "h-9 px-2" : "gap-3 px-3 py-3",
            className
          )}
          {...props}
        >
          <div
            className={cn(
              "rounded-lg bg-muted flex items-center justify-center",
              isCompact ? "w-6 h-6" : "w-9 h-9"
            )}
          >
            <LoaderIcon className={cn(isCompact ? "w-3.5 h-3.5" : "w-4 h-4")} />
          </div>
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "bg-muted rounded animate-pulse",
                isCompact ? "h-3 w-16" : "h-4 w-24"
              )}
            />
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <div ref={dropdownRef}>
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center w-full rounded-lg transition-all duration-200 border",
              isCompact ? "h-9 gap-2 px-2" : "gap-3 px-3 py-2.5 rounded-xl",
              isOpen
                ? "bg-accent border-border"
                : "hover:bg-accent border-transparent hover:border-border"
            )}
          >
            {selectedItem ? (
              <>
                <TenantAvatar item={selectedItem} size={isCompact ? "sm" : "md"} />
                <div className="flex-1 min-w-0 text-left">
                  <p
                    className={cn(
                      "font-semibold truncate",
                      isCompact ? "text-xs" : "text-sm"
                    )}
                  >
                    {selectedItem.name}
                  </p>
                  {!isCompact && selectedItem.subtitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      {selectedItem.subtitle}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div
                  className={cn(
                    "bg-muted flex items-center justify-center",
                    isCompact ? "w-6 h-6 rounded-md" : "w-9 h-9 rounded-lg"
                  )}
                >
                  <BuildingIcon
                    className={cn(isCompact ? "w-3.5 h-3.5" : "w-4 h-4")}
                  />
                </div>
                <span
                  className={cn(
                    "flex-1 text-left text-muted-foreground",
                    isCompact ? "text-xs" : "text-sm"
                  )}
                >
                  {placeholder}
                </span>
              </>
            )}
            <ChevronDownIcon
              className={cn(
                "text-muted-foreground transition-transform duration-200 flex-shrink-0",
                isCompact ? "w-3.5 h-3.5" : "w-4 h-4",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div
              className={cn(
                "absolute left-0 right-0 bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden",
                "animate-in fade-in duration-150",
                isCompact
                  ? "bottom-full mb-2 slide-in-from-bottom-2"
                  : "top-full mt-2 slide-in-from-top-2"
              )}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>

              {/* Search */}
              {items.length > searchThreshold && (
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 border border-border rounded-md bg-background text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="max-h-[320px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    {emptyMessage}
                  </div>
                ) : grouped && groups ? (
                  Array.from(groups.entries()).map(([group, groupItems]) => (
                    <div key={group}>
                      <div className="px-4 py-2 bg-muted/50 border-b border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {group}
                        </span>
                      </div>
                      {groupItems.map((item) => (
                        <TenantItemRow
                          key={item.id}
                          item={item}
                          isSelected={item.id === selectedId}
                          onSelect={handleSelect}
                          onSetDefault={onSetDefault ? handleSetDefault : undefined}
                          isSettingDefault={settingDefaultId === item.id}
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  filtered.map((item) => (
                    <TenantItemRow
                      key={item.id}
                      item={item}
                      isSelected={item.id === selectedId}
                      onSelect={handleSelect}
                      onSetDefault={onSetDefault ? handleSetDefault : undefined}
                      isSettingDefault={settingDefaultId === item.id}
                    />
                  ))
                )}
              </div>

              {/* Create new */}
              {onCreateNew && (
                <div className="border-t border-border p-3 bg-muted/50">
                  <button
                    type="button"
                    onClick={() => {
                      onCreateNew()
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>{createNewLabel}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
)
TenantSwitcher.displayName = "TenantSwitcher"

// --- TenantItemRow ---

function TenantItemRow({
  item,
  isSelected,
  onSelect,
  onSetDefault,
  isSettingDefault,
}: {
  item: TenantItem
  isSelected: boolean
  onSelect: (item: TenantItem) => void
  onSetDefault?: (item: TenantItem, e: React.MouseEvent) => void
  isSettingDefault: boolean
}) {
  return (
    <div
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 transition-colors group cursor-pointer",
        "hover:bg-accent",
        isSelected && "bg-accent/50"
      )}
      onClick={() => onSelect(item)}
      role="option"
      aria-selected={isSelected}
    >
      <TenantAvatar item={item} size="sm" />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{item.name}</span>
          {item.isDefault && (
            <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">
              DEFAULT
            </span>
          )}
        </div>
        {item.subtitle && (
          <span className="text-xs text-muted-foreground">{item.subtitle}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {item.role && (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium border bg-muted text-muted-foreground capitalize">
            {item.role}
          </span>
        )}

        {onSetDefault && !item.isDefault && (
          <button
            type="button"
            onClick={(e) => onSetDefault(item, e)}
            disabled={isSettingDefault}
            className={cn(
              "p-1 rounded-md transition-all text-muted-foreground hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20",
              "opacity-0 group-hover:opacity-100",
              isSettingDefault && "opacity-100"
            )}
            title="Set as default"
          >
            {isSettingDefault ? (
              <LoaderIcon className="w-3.5 h-3.5" />
            ) : (
              <StarIcon className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {onSetDefault && item.isDefault && (
          <StarIcon className="w-3.5 h-3.5 text-amber-500" filled />
        )}

        {isSelected && (
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <CheckIcon className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>
    </div>
  )
}

export { TenantSwitcher }
