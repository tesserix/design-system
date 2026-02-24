import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-3 rounded-xl border bg-card p-4 shadow-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-border text-card-foreground",
        success: "border-primary/30 bg-primary/10 text-primary",
        warning: "border-accent bg-accent text-accent-foreground",
        destructive: "border-destructive/40 bg-destructive/10 text-destructive",
        info: "border-primary/30 bg-primary/10 text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const toastViewportVariants = cva(
  "fixed z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-md",
  {
    variants: {
      position: {
        "top-right": "right-0 top-0",
        "top-left": "left-0 top-0",
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  }
)

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>["variant"]>

export interface ToastOptions {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  duration?: number
  actionLabel?: string
  onAction?: () => void
}

interface ToastRecord extends ToastOptions {
  id: string
}

interface ToastContextValue {
  toasts: ToastRecord[]
  toast: (options: ToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

const useToastContext = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("Toast components must be used within ToastProvider")
  }
  return context
}

const createToastId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export interface ToastProviderProps {
  children: React.ReactNode
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = React.useCallback(() => {
    setToasts([])
  }, [])

  const toast = React.useCallback((options: ToastOptions) => {
    const id = createToastId()
    setToasts((current) => [...current, { id, ...options }])
    return id
  }, [])

  const value = React.useMemo(
    () => ({
      toasts,
      toast,
      dismiss,
      clear,
    }),
    [toasts, toast, dismiss, clear]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

const useToast = () => {
  const { toast, dismiss, clear } = useToastContext()
  return { toast, dismiss, clear }
}

interface ToastRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  duration?: number
  onDismiss?: (id: string) => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastRootProps>(
  (
    {
      className,
      variant,
      id,
      title,
      description,
      actionLabel,
      onAction,
      duration = 4000,
      onDismiss,
      ...props
    },
    ref
  ) => {
    React.useEffect(() => {
      if (!Number.isFinite(duration) || duration <= 0) {
        return
      }

      const timeoutId = window.setTimeout(() => {
        onDismiss?.(id)
      }, duration)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }, [duration, id, onDismiss])

    return (
      <div ref={ref} role="status" aria-live="polite" className={cn(toastVariants({ variant }), className)} {...props}>
        <div className="flex-1 space-y-1">
          {title ? <ToastTitle>{title}</ToastTitle> : null}
          {description ? <ToastDescription>{description}</ToastDescription> : null}
        </div>

        {actionLabel ? (
          <button
            type="button"
            className="rounded-md border border-current/25 px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-current/10"
            onClick={() => {
              onAction?.()
              onDismiss?.(id)
            }}
          >
            {actionLabel}
          </button>
        ) : null}

        <ToastClose onClick={() => onDismiss?.(id)} />
      </div>
    )
  }
)
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("text-sm font-semibold tracking-tight", className)} {...props} />
  )
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
  )
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Close notification"
      className={cn(
        "rounded-md p-1.5 text-current/70 transition-colors hover:bg-current/10 hover:text-current focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
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
    </button>
  )
)
ToastClose.displayName = "ToastClose"

export interface ToastViewportProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastViewportVariants> {}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, position, ...props }, ref) => {
    const { toasts, dismiss } = useToastContext()

    return (
      <div ref={ref} className={cn(toastViewportVariants({ position }), className)} {...props}>
        {toasts.map(({ id, ...item }) => (
          <Toast key={id} id={id} onDismiss={dismiss} {...item} />
        ))}
      </div>
    )
  }
)
ToastViewport.displayName = "ToastViewport"

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  useToast,
  toastVariants,
  toastViewportVariants,
}
