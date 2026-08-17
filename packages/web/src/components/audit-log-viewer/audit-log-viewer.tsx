import * as React from "react"

import { cn } from "../../lib/utils"

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target?: string
  timestamp: string
  metadata?: string
  /** Opaque, consumer-defined id of the system this entry came from. */
  source?: string
}

export interface AuditLogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: AuditLogEntry[]
  emptyMessage?: string
  onEntrySelect?: (entryId: string) => void
  /** Renders the label for an entry's `source`. Defaults to the raw id. */
  renderSource?: (source: string) => React.ReactNode
  /** Renders an entry's `metadata`. Defaults to the raw string. */
  renderMetadata?: (metadata: string) => React.ReactNode
}

const ROW_CLASSNAME = "w-full rounded-md border p-3 text-left"

const AuditLogViewer = React.forwardRef<HTMLDivElement, AuditLogViewerProps>(
  (
    { className, entries, emptyMessage = "No audit entries", onEntrySelect, renderSource, renderMetadata, ...props },
    ref
  ) => (
    <div ref={ref} className={cn("space-y-3 rounded-xl border bg-card p-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Audit Log</h3>
        <span className="text-xs text-muted-foreground">{entries.length} entries</span>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ol className="space-y-2">
          {entries.map((entry) => {
            const content = (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {entry.actor} {entry.action}
                    {entry.target ? ` ${entry.target}` : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    {entry.source ? (
                      <span className="text-xs text-muted-foreground">
                        {renderSource ? renderSource(entry.source) : entry.source}
                      </span>
                    ) : null}
                    <time className="text-xs text-muted-foreground">{entry.timestamp}</time>
                  </div>
                </div>
                {entry.metadata ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {renderMetadata ? renderMetadata(entry.metadata) : entry.metadata}
                  </div>
                ) : null}
              </>
            )

            return (
              <li key={entry.id}>
                {onEntrySelect ? (
                  <button
                    type="button"
                    className={cn(ROW_CLASSNAME, "hover:bg-accent")}
                    onClick={() => onEntrySelect(entry.id)}
                  >
                    {content}
                  </button>
                ) : (
                  <div className={ROW_CLASSNAME}>{content}</div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
)
AuditLogViewer.displayName = "AuditLogViewer"

export { AuditLogViewer }
