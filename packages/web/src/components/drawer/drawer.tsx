import * as React from "react"
import ReactDOM from "react-dom"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

interface DrawerContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  titleId?: string
  descriptionId?: string
  setTitleId: (id?: string) => void
  setDescriptionId: (id?: string) => void
}

const DrawerContext = React.createContext<DrawerContextValue | undefined>(undefined)

const useDrawer = () => {
  const context = React.useContext(DrawerContext)
  if (!context) {
    throw new Error("Drawer components must be used within Drawer")
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

const getFocusableElements = (element: HTMLElement) => {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",")

  return Array.from(element.querySelectorAll<HTMLElement>(selector)).filter(
    (node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true"
  )
}

export interface DrawerProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Drawer = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DrawerProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [titleId, setTitleId] = React.useState<string | undefined>(undefined)
  const [descriptionId, setDescriptionId] = React.useState<string | undefined>(undefined)
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
    <DrawerContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        triggerRef,
        titleId,
        descriptionId,
        setTitleId,
        setDescriptionId,
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}

interface DrawerTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ className, onClick, asChild = false, ...props }, ref) => {
    const { onOpenChange, triggerRef } = useDrawer()
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={(node: HTMLButtonElement | null) => {
          triggerRef.current = node
          setRef(ref, node)
        }}
        {...(!asChild && { type: "button" })}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onOpenChange(true)
          onClick?.(e)
        }}
        className={className}
        {...props}
      />
    )
  }
)
DrawerTrigger.displayName = "DrawerTrigger"

const DrawerPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useDrawer()

  if (!open) return null

  return typeof document !== "undefined" ? ReactDOM.createPortal(children, document.body) : null
}

const DrawerOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { onOpenChange, open } = useDrawer()

    return (
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        onMouseDown={() => onOpenChange(false)}
        {...props}
      />
    )
  }
)
DrawerOverlay.displayName = "DrawerOverlay"

const drawerContentVariants = cva(
  "fixed z-50 gap-4 bg-card p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b rounded-b-lg data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t rounded-t-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r rounded-r-lg data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l rounded-l-lg data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right max-w-sm",
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  }
)

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof drawerContentVariants> {}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ side, className, children, onKeyDown, ...props }, ref) => {
    const { open, onOpenChange, triggerRef, titleId, descriptionId } = useDrawer()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const previousFocusRef = React.useRef<HTMLElement | null>(null)

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!open || !contentRef.current) return

      previousFocusRef.current = document.activeElement as HTMLElement
      const focusableElements = getFocusableElements(contentRef.current)
      ;(focusableElements[0] || contentRef.current).focus()

      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      return () => {
        document.body.style.overflow = originalOverflow
        triggerRef.current?.focus()
        if (triggerRef.current == null) {
          previousFocusRef.current?.focus()
        }
      }
    }, [open, triggerRef])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onOpenChange(false)
        return
      }

      if (event.key === "Tab" && contentRef.current) {
        const focusableElements = getFocusableElements(contentRef.current)
        if (focusableElements.length === 0) {
          event.preventDefault()
          return
        }

        const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

        if (event.shiftKey) {
          if (currentIndex <= 0) {
            event.preventDefault()
            focusableElements[focusableElements.length - 1]?.focus()
          }
          return
        }

        if (currentIndex === focusableElements.length - 1) {
          event.preventDefault()
          focusableElements[0]?.focus()
        }
      }

      onKeyDown?.(event)
    }

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          data-state={open ? "open" : "closed"}
          className={cn(drawerContentVariants({ side }), className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
          <DrawerClose />
        </div>
      </DrawerPortal>
    )
  }
)
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, id, ...props }, ref) => {
    const { setTitleId } = useDrawer()
    const generatedId = React.useId()
    const titleId = id || generatedId

    React.useEffect(() => {
      setTitleId(titleId)
      return () => setTitleId(undefined)
    }, [setTitleId, titleId])

    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn("text-lg font-semibold text-card-foreground", className)}
        {...props}
      />
    )
  }
)
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, id, ...props }, ref) => {
    const { setDescriptionId } = useDrawer()
    const generatedId = React.useId()
    const descriptionId = id || generatedId

    React.useEffect(() => {
      setDescriptionId(descriptionId)
      return () => setDescriptionId(undefined)
    }, [setDescriptionId, descriptionId])

    return <p ref={ref} id={descriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />
  }
)
DrawerDescription.displayName = "DrawerDescription"

interface DrawerCloseProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ className, onClick, asChild = false, ...props }, ref) => {
    const { onOpenChange } = useDrawer()
    const Comp = asChild ? Slot : "button"

    if (asChild) {
      return (
        <Comp
          ref={ref}
          className={className}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            onOpenChange(false)
            onClick?.(e)
          }}
          {...props}
        />
      )
    }

    return (
      <Comp
        ref={ref}
        type="button"
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className
        )}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onOpenChange(false)
          onClick?.(e)
        }}
        {...props}
      >
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
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </Comp>
    )
  }
)
DrawerClose.displayName = "DrawerClose"

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
}
