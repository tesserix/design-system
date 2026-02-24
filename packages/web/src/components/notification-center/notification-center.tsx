import * as React from "react"

import { cn } from "../../lib/utils"

export interface NotificationItem {
  id: string
  title: string
  description?: string
  time?: string
  read?: boolean
}

export interface NotificationCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  items: NotificationItem[]
  onMarkRead?: (id: string) => void
  onMarkAllRead?: () => void
}

const NotificationCenter = React.forwardRef<HTMLDivElement, NotificationCenterProps>(
  ({ className, items, onMarkRead, onMarkAllRead, ...props }, ref) => {
    const unreadCount = items.filter((item) => !item.read).length

    return (
      <div ref={ref} className={cn("rounded-xl border", className)} {...props}>
        <div className="flex items-center justify-between border-b p-3">
          <p className="text-sm font-semibold">Notifications ({unreadCount})</p>
          <button type="button" className="text-xs text-primary" onClick={onMarkAllRead}>
            Mark all read
          </button>
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn("w-full p-3 text-left", !item.read && "bg-primary/5")}
              onClick={() => onMarkRead?.(item.id)}
            >
              <p className="text-sm font-medium">{item.title}</p>
              {item.description ? <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p> : null}
              {item.time ? <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p> : null}
            </button>
          ))}
        </div>
      </div>
    )
  }
)
NotificationCenter.displayName = "NotificationCenter"

export { NotificationCenter }
