import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

const usePopover = () => {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error("Popover components must be used within Popover")
  }
  return context
}

export interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Popover = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: PopoverProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const triggerRef = React.useRef<HTMLElement | null>(null)
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
    <PopoverContext.Provider value={{ open, onOpenChange: handleOpenChange, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  )
}

interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ className, onClick, asChild = false, ...props }, ref) => {
  const { onOpenChange, open, triggerRef } = usePopover()
  const Comp = asChild ? Slot : "button"

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement)

  return (
    <Comp
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      {...(!asChild && { type: "button" })}
      onClick={(e) => {
        onOpenChange(!open)
        onClick?.(e)
      }}
      className={className}
      aria-expanded={open}
      aria-haspopup="dialog"
      {...props}
    />
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const popoverContentVariants = cva(
  "absolute z-50 rounded-md p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  {
    variants: {
      variant: {
        default: "border bg-popover",
        glass:
          "border border-white/20 bg-white/10 backdrop-blur-md dark:border-white/10 dark:bg-black/20 supports-[backdrop-filter]:bg-white/10 supports-[backdrop-filter]:dark:bg-black/20",
      },
      side: {
        top: "bottom-full mb-2",
        right: "left-full ml-2",
        bottom: "top-full mt-2",
        left: "right-full mr-2",
      },
      align: {
        start: "",
        center: "",
        end: "",
      },
    },
    compoundVariants: [
      { side: "top", align: "start", class: "left-0" },
      { side: "top", align: "center", class: "left-1/2 -translate-x-1/2" },
      { side: "top", align: "end", class: "right-0" },
      { side: "bottom", align: "start", class: "left-0" },
      { side: "bottom", align: "center", class: "left-1/2 -translate-x-1/2" },
      { side: "bottom", align: "end", class: "right-0" },
      { side: "left", align: "start", class: "top-0" },
      { side: "left", align: "center", class: "top-1/2 -translate-y-1/2" },
      { side: "left", align: "end", class: "bottom-0" },
      { side: "right", align: "start", class: "top-0" },
      { side: "right", align: "center", class: "top-1/2 -translate-y-1/2" },
      { side: "right", align: "end", class: "bottom-0" },
    ],
    defaultVariants: {
      variant: "default",
      side: "bottom",
      align: "center",
    },
  }
)

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof popoverContentVariants> {}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, variant, side, align, children, ...props }, ref) => {
    const { open, onOpenChange, triggerRef } = usePopover()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useImperativeHandle(ref, () => contentRef.current!)

    React.useEffect(() => {
      if (!open) return

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

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onOpenChange(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }, [open, onOpenChange, triggerRef])

    if (!open) return null

    return (
      <div className="relative inline-block">
        <div
          ref={contentRef}
          className={cn(popoverContentVariants({ variant, side, align }), className)}
          data-state={open ? "open" : "closed"}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
