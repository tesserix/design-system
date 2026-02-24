import * as React from "react"

import { cn } from "../../lib/utils"

export interface BulkAction {
  id: string
  label: string
  dangerous?: boolean
  disabled?: boolean
}

export interface BulkActionsBarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedCount: number
  actions: BulkAction[]
  onAction?: (actionId: string) => void
  onClearSelection?: () => void
}

const BulkActionsBar = React.forwardRef<HTMLDivElement, BulkActionsBarProps>(
  ({ className, selectedCount, actions, onAction, onClearSelection, ...props }, ref) => {
    if (selectedCount <= 0) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3",
          className
        )}
        {...props}
      >
        <p className="text-sm font-medium">{selectedCount} selected</p>
        <div className="flex flex-wrap items-center gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm disabled:opacity-50",
                action.dangerous && "border-destructive text-destructive"
              )}
              onClick={() => onAction?.(action.id)}
            >
              {action.label}
            </button>
          ))}
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm"
            onClick={() => onClearSelection?.()}
          >
            Clear
          </button>
        </div>
      </div>
    )
  }
)
BulkActionsBar.displayName = "BulkActionsBar"

export { BulkActionsBar }
