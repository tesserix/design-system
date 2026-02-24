import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import ReactDOM from "react-dom"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  titleId?: string
  descriptionId?: string
  setTitleId: (id?: string) => void
  setDescriptionId: (id?: string) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within Dialog")
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

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = ({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: DialogProps) => {
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
    <DialogContext.Provider
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
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, onClick, asChild = false, ...props }, ref) => {
    const { onOpenChange, triggerRef } = useDialog()
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
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = useDialog()

  if (!open) return null

  return typeof document !== "undefined" ? ReactDOM.createPortal(children, document.body) : null
}

const DialogOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => {
    const { onOpenChange, open } = useDialog()

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
DialogOverlay.displayName = "DialogOverlay"

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
  ,
  {
    variants: {
      variant: {
        default: "border bg-card",
        glass:
          "border border-white/20 bg-white/10 backdrop-blur-md dark:border-white/10 dark:bg-black/20 supports-[backdrop-filter]:bg-white/10 supports-[backdrop-filter]:dark:bg-black/20",
      },
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof dialogContentVariants> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, variant, size, children, onKeyDown, ...props }, ref) => {
    const { open, onOpenChange, triggerRef, titleId, descriptionId } = useDialog()
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
      <DialogPortal>
        <DialogOverlay />
        <div
          ref={contentRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          data-state={open ? "open" : "closed"}
          className={cn(dialogContentVariants({ variant, size }), className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, id, ...props }, ref) => {
    const { setTitleId } = useDialog()
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
        className={cn("text-lg font-semibold leading-none tracking-tight text-card-foreground", className)}
        {...props}
      />
    )
  }
)
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, id, ...props }, ref) => {
    const { setDescriptionId } = useDialog()
    const generatedId = React.useId()
    const descriptionId = id || generatedId

    React.useEffect(() => {
      setDescriptionId(descriptionId)
      return () => setDescriptionId(undefined)
    }, [setDescriptionId, descriptionId])

    return <p ref={ref} id={descriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />
  }
)
DialogDescription.displayName = "DialogDescription"

interface DialogCloseProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClick, asChild = false, ...props }, ref) => {
    const { onOpenChange } = useDialog()
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
DialogClose.displayName = "DialogClose"

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
