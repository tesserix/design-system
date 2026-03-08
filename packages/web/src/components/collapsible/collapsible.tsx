import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

interface CollapsibleContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | undefined>(undefined)

const useCollapsible = () => {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("Collapsible components must be used within Collapsible")
  }
  return context
}

export interface CollapsibleProps extends React.ComponentPropsWithoutRef<"div"> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open: controlledOpen, defaultOpen = false, onOpenChange, children, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
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
      <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    )
  }
)
Collapsible.displayName = "Collapsible"

interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, children, onClick, asChild = false, ...props }, ref) => {
  const { open, onOpenChange } = useCollapsible()
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      {...(!asChild && { type: "button" })}
      className={cn("flex w-full items-center justify-between", className)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        onOpenChange(!open)
        onClick?.(e)
      }}
      aria-expanded={open}
      {...props}
    >
      {children}
    </Comp>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  const { open } = useCollapsible()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number | undefined>(open ? undefined : 0)

  React.useImperativeHandle(ref, () => contentRef.current!)

  React.useEffect(() => {
    if (!contentRef.current) return

    if (open) {
      const contentHeight = contentRef.current.scrollHeight
      setHeight(contentHeight)
      const timer = setTimeout(() => setHeight(undefined), 300)
      return () => clearTimeout(timer)
    } else {
      setHeight(contentRef.current.scrollHeight)
      requestAnimationFrame(() => {
        setHeight(0)
      })
    }
  }, [open])

  return (
    <div
      ref={contentRef}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        className
      )}
      style={{ height }}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
