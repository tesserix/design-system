import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1.5 transition-colors",
  {
    variants: {
      status: {
        success:
          "border-transparent bg-success-muted text-success-muted-foreground",
        warning:
          "border-transparent bg-warning-muted text-warning-muted-foreground",
        error:
          "border-transparent bg-error-muted text-error-muted-foreground",
        info: "border-transparent bg-info-muted text-info-muted-foreground",
        neutral:
          "border-transparent bg-neutral-muted text-neutral-muted-foreground",
      },
      size: {
        sm: "px-2 py-0 text-xs [&>svg]:size-3",
        default: "px-2.5 py-0.5 text-xs [&>svg]:size-3.5",
        lg: "px-3 py-1 text-sm [&>svg]:size-4",
      },
    },
    defaultVariants: {
      status: "neutral",
      size: "default",
    },
  }
)

type StatusType = "success" | "warning" | "error" | "info" | "neutral"

const statusMappings = {
  order: {
    PENDING: "warning" as StatusType,
    CONFIRMED: "info" as StatusType,
    PROCESSING: "info" as StatusType,
    SHIPPED: "info" as StatusType,
    DELIVERED: "success" as StatusType,
    CANCELLED: "error" as StatusType,
    REFUNDED: "error" as StatusType,
    RETURNED: "warning" as StatusType,
    FAILED: "error" as StatusType,
  },
  payment: {
    PENDING: "warning" as StatusType,
    PAID: "success" as StatusType,
    PARTIALLY_PAID: "warning" as StatusType,
    REFUNDED: "error" as StatusType,
    PARTIALLY_REFUNDED: "warning" as StatusType,
    FAILED: "error" as StatusType,
    CANCELLED: "error" as StatusType,
  },
  user: {
    ACTIVE: "success" as StatusType,
    INACTIVE: "neutral" as StatusType,
    BLOCKED: "error" as StatusType,
    PENDING: "warning" as StatusType,
    SUSPENDED: "error" as StatusType,
  },
  product: {
    ACTIVE: "success" as StatusType,
    INACTIVE: "neutral" as StatusType,
    DRAFT: "warning" as StatusType,
    ARCHIVED: "neutral" as StatusType,
    OUT_OF_STOCK: "error" as StatusType,
  },
  coupon: {
    ACTIVE: "success" as StatusType,
    EXPIRED: "error" as StatusType,
    SCHEDULED: "info" as StatusType,
    INACTIVE: "neutral" as StatusType,
    USED: "warning" as StatusType,
  },
  review: {
    PENDING: "warning" as StatusType,
    APPROVED: "success" as StatusType,
    REJECTED: "error" as StatusType,
    FLAGGED: "error" as StatusType,
  },
  boolean: {
    true: "success" as StatusType,
    false: "neutral" as StatusType,
    yes: "success" as StatusType,
    no: "neutral" as StatusType,
  },
  inventory: {
    IN_STOCK: "success" as StatusType,
    LOW_STOCK: "warning" as StatusType,
    OUT_OF_STOCK: "error" as StatusType,
  },
  vendor: {
    APPROVED: "success" as StatusType,
    PENDING: "warning" as StatusType,
    REJECTED: "error" as StatusType,
    SUSPENDED: "error" as StatusType,
    ACTIVE: "success" as StatusType,
    INACTIVE: "neutral" as StatusType,
  },
  campaign: {
    DRAFT: "neutral" as StatusType,
    SCHEDULED: "info" as StatusType,
    SENDING: "info" as StatusType,
    SENT: "success" as StatusType,
    COMPLETED: "success" as StatusType,
    PAUSED: "warning" as StatusType,
    CANCELLED: "error" as StatusType,
  },
  giftCard: {
    ACTIVE: "success" as StatusType,
    REDEEMED: "info" as StatusType,
    EXPIRED: "error" as StatusType,
    CANCELLED: "neutral" as StatusType,
  },
} as const

interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof statusBadgeVariants> {
  status?: StatusType
  icon?: React.ComponentType<{ className?: string }>
  showIcon?: boolean
  children: React.ReactNode
}

function StatusBadge({
  className,
  status = "neutral",
  size,
  icon: Icon,
  showIcon = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      data-status={status}
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {showIcon && Icon && <Icon className="shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  )
}

function getStatusFromMapping<T extends keyof typeof statusMappings>(
  category: T,
  value: string | boolean
): StatusType {
  const mapping = statusMappings[category] as Record<string, StatusType>
  const key = typeof value === "boolean" ? String(value) : value.toUpperCase()
  return mapping[key] || "neutral"
}

export { StatusBadge, statusBadgeVariants, statusMappings, getStatusFromMapping }
export type { StatusBadgeProps, StatusType }
