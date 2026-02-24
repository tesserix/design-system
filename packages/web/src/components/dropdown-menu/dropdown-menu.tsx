import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  contentId: string
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

const useDropdownMenu = () => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within DropdownMenu")
  }
  return context
}

const setRef = <T,>(ref: React.ForwardedRef<T>, value: T) => {
  if (typeof ref === "function") {
    ref(value)
    return
  }
  if (ref) {
    ref.current = value
  }
}

const getEnabledMenuItems = (menuElement: HTMLElement) =>
  Array.from(menuElement.querySelectorAll<HTMLButtonElement>("[role='menuitem']:not([disabled])"))

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const DropdownMenu = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: DropdownMenuProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentId = React.useId()
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen)
      }
      onOpenChange?.(newOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange: handleOpenChange, triggerRef, contentId }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className, onClick, onKeyDown, asChild = false, ...props }, ref) => {
    const { onOpenChange, open, triggerRef, contentId } = useDropdownMenu()
    const Comp = asChild ? Slot : "button"

    const handleOpen = () => {
      onOpenChange(true)
      requestAnimationFrame(() => {
        const menu = document.getElementById(contentId)
        if (!menu) return
        const firstItem = getEnabledMenuItems(menu)[0]
        firstItem?.focus()
      })
    }

    return (
      <Comp
        ref={(node: HTMLButtonElement | null) => {
          triggerRef.current = node
          setRef(ref, node)
        }}
        {...(!asChild && { type: "button" })}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onOpenChange(!open)
          onClick?.(e)
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleOpen()
          }
          onKeyDown?.(e)
        }}
        className={className}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={open ? contentId : undefined}
        {...props}
      />
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, onKeyDown, ...props }, ref) => {
    const { open, onOpenChange, triggerRef, contentId } = useDropdownMenu()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!open) return

      const menu = contentRef.current
      if (!menu) return

      const firstItem = getEnabledMenuItems(menu)[0]
      firstItem?.focus()

      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          onOpenChange(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open, onOpenChange, triggerRef])

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
      <div className="relative inline-block">
        <div
          ref={contentRef}
          id={contentId}
          role="menu"
          tabIndex={-1}
          aria-orientation="vertical"
          className={cn(
            "absolute right-0 top-full z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            className
          )}
          data-state={open ? "open" : "closed"}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault()
              onOpenChange(false)
              triggerRef.current?.focus()
              return
            }

            if (e.key === "ArrowDown") {
              e.preventDefault()
              moveFocus("next")
              return
            }

            if (e.key === "ArrowUp") {
              e.preventDefault()
              moveFocus("prev")
              return
            }

            if (e.key === "Home") {
              e.preventDefault()
              moveFocus("first")
              return
            }

            if (e.key === "End") {
              e.preventDefault()
              moveFocus("last")
              return
            }

            if (e.key === "Tab") {
              onOpenChange(false)
            }

            onKeyDown?.(e)
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { disabled?: boolean }
>(({ className, disabled, onClick, ...props }, ref) => {
  const { onOpenChange } = useDropdownMenu()

  return (
    <button
      ref={ref}
      role="menuitem"
      type="button"
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        !disabled && "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={(e) => {
        if (!disabled) {
          onClick?.(e)
          onOpenChange(false)
        }
      }}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="separator" className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  )
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
  )
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
}
