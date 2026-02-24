import * as React from "react"

import { cn } from "../../lib/utils"

interface ContextMenuPosition {
  x: number
  y: number
}

interface ContextMenuContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: ContextMenuPosition
  setPosition: (position: ContextMenuPosition) => void
  contentId: string
}

const ContextMenuContext = React.createContext<ContextMenuContextValue | undefined>(undefined)

const useContextMenu = () => {
  const context = React.useContext(ContextMenuContext)
  if (!context) {
    throw new Error("ContextMenu components must be used within ContextMenu")
  }
  return context
}

const getEnabledMenuItems = (element: HTMLElement) =>
  Array.from(element.querySelectorAll<HTMLButtonElement>("[role='menuitem']:not([disabled])"))

export interface ContextMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const ContextMenu = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: ContextMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [position, setPosition] = React.useState<ContextMenuPosition>({ x: 0, y: 0 })
  const contentId = React.useId()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <ContextMenuContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        position,
        setPosition,
        contentId,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  )
}

const ContextMenuTrigger = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, onContextMenu, onKeyDown, ...props }, ref) => {
    const { onOpenChange, setPosition, contentId } = useContextMenu()

    return (
      <div
        ref={ref}
        tabIndex={0}
        aria-haspopup="menu"
        aria-controls={contentId}
        className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
        onContextMenu={(event) => {
          event.preventDefault()
          setPosition({ x: event.clientX, y: event.clientY })
          onOpenChange(true)
          onContextMenu?.(event)
        }}
        onKeyDown={(event) => {
          if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) {
            event.preventDefault()
            const target = event.currentTarget.getBoundingClientRect()
            setPosition({ x: target.left + 8, y: target.top + 8 })
            onOpenChange(true)
          }
          onKeyDown?.(event)
        }}
        {...props}
      />
    )
  }
)
ContextMenuTrigger.displayName = "ContextMenuTrigger"

const ContextMenuContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, onKeyDown, ...props }, ref) => {
    const { open, onOpenChange, position, contentId } = useContextMenu()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!open) return

      const menu = contentRef.current
      if (!menu) return

      const firstItem = getEnabledMenuItems(menu)[0]
      firstItem?.focus()

      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          onOpenChange(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open, onOpenChange])

    if (!open) return null

    const moveFocus = (direction: "next" | "prev" | "first" | "last") => {
      const menu = contentRef.current
      if (!menu) return
      const items = getEnabledMenuItems(menu)
      if (items.length === 0) return

      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement)

      if (direction === "first") {
        items[0]?.focus()
        return
      }
      if (direction === "last") {
        items[items.length - 1]?.focus()
        return
      }
      if (direction === "next") {
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % items.length : 0
        items[nextIndex]?.focus()
        return
      }

      const prevIndex = currentIndex >= 0 ? (currentIndex - 1 + items.length) % items.length : items.length - 1
      items[prevIndex]?.focus()
    }

    return (
      <div
        ref={contentRef}
        id={contentId}
        role="menu"
        tabIndex={-1}
        aria-orientation="vertical"
        className={cn(
          "fixed z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          className
        )}
        style={{ left: position.x, top: position.y }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault()
            onOpenChange(false)
            return
          }
          if (event.key === "ArrowDown") {
            event.preventDefault()
            moveFocus("next")
            return
          }
          if (event.key === "ArrowUp") {
            event.preventDefault()
            moveFocus("prev")
            return
          }
          if (event.key === "Home") {
            event.preventDefault()
            moveFocus("first")
            return
          }
          if (event.key === "End") {
            event.preventDefault()
            moveFocus("last")
            return
          }
          if (event.key === "Tab") {
            onOpenChange(false)
          }
          onKeyDown?.(event)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContextMenuContent.displayName = "ContextMenuContent"

const ContextMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { disabled?: boolean }
>(({ className, disabled, onClick, ...props }, ref) => {
  const { onOpenChange } = useContextMenu()

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      disabled={disabled}
      className={cn(
        "relative flex w-full select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      onClick={(event) => {
        if (!disabled) {
          onClick?.(event)
          onOpenChange(false)
        }
      }}
      {...props}
    />
  )
})
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  )
)
ContextMenuSeparator.displayName = "ContextMenuSeparator"

const ContextMenuLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
  )
)
ContextMenuLabel.displayName = "ContextMenuLabel"

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
)
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
}
