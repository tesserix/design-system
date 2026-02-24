import * as React from "react"

import { cn } from "../../lib/utils"

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target?: string
  timestamp: string
  metadata?: string
}

export interface AuditLogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: AuditLogEntry[]
  emptyMessage?: string
  onEntrySelect?: (entryId: string) => void
}

const AuditLogViewer = React.forwardRef<HTMLDivElement, AuditLogViewerProps>(
  ({ className, entries, emptyMessage = "No audit entries", onEntrySelect, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3 rounded-xl border bg-card p-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Audit Log</h3>
        <span className="text-xs text-muted-foreground">{entries.length} entries</span>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ol className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id}>
              <button
                type="button"
                className="w-full rounded-md border p-3 text-left hover:bg-accent"
                onClick={() => onEntrySelect?.(entry.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {entry.actor} {entry.action}
                    {entry.target ? ` ${entry.target}` : ""}
                  </p>
                  <time className="text-xs text-muted-foreground">{entry.timestamp}</time>
                </div>
                {entry.metadata ? <p className="mt-1 text-xs text-muted-foreground">{entry.metadata}</p> : null}
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
)
AuditLogViewer.displayName = "AuditLogViewer"

export { AuditLogViewer }
