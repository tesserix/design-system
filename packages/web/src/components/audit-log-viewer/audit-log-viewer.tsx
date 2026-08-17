import * as React from "react"

import {
  AuditLogCount,
  AuditLogEmpty,
  AuditLogHeader,
  AuditLogList,
  AuditLogMetadata,
  AuditLogRoot,
  AuditLogRow,
  AuditLogSource,
  AuditLogSummary,
  AuditLogTime,
  AuditLogTitle,
} from "./audit-log-parts"

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

const AuditLogViewerRoot = React.forwardRef<HTMLDivElement, AuditLogViewerProps>(
  (
    { className, entries, emptyMessage = "No audit entries", onEntrySelect, renderSource, renderMetadata, ...props },
    ref
  ) => (
    <AuditLogRoot ref={ref} className={className} onEntrySelect={onEntrySelect} {...props}>
      <AuditLogHeader>
        <AuditLogTitle>Audit Log</AuditLogTitle>
        <AuditLogCount>{entries.length} entries</AuditLogCount>
      </AuditLogHeader>

      {entries.length === 0 ? (
        <AuditLogEmpty>{emptyMessage}</AuditLogEmpty>
      ) : (
        <AuditLogList>
          {entries.map((entry) => (
            <AuditLogRow key={entry.id} entryId={entry.id}>
              <AuditLogSummary>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {entry.actor} {entry.action}
                    {entry.target ? ` ${entry.target}` : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    {entry.source ? (
                      <AuditLogSource>
                        {renderSource ? renderSource(entry.source) : entry.source}
                      </AuditLogSource>
                    ) : null}
                    <AuditLogTime>{entry.timestamp}</AuditLogTime>
                  </div>
                </div>
                {entry.metadata ? (
                  <AuditLogMetadata>
                    {renderMetadata ? renderMetadata(entry.metadata) : entry.metadata}
                  </AuditLogMetadata>
                ) : null}
              </AuditLogSummary>
            </AuditLogRow>
          ))}
        </AuditLogList>
      )}
    </AuditLogRoot>
  )
)
AuditLogViewerRoot.displayName = "AuditLogViewer"

/**
 * Data-driven audit log. Pass `entries` for the common case; import the
 * parts (also attached here as `AuditLogViewer.Row` etc.) to compose a
 * custom layout.
 */
const AuditLogViewer = Object.assign(AuditLogViewerRoot, {
  Root: AuditLogRoot,
  Header: AuditLogHeader,
  Title: AuditLogTitle,
  Count: AuditLogCount,
  List: AuditLogList,
  Row: AuditLogRow,
  Summary: AuditLogSummary,
  Time: AuditLogTime,
  Source: AuditLogSource,
  Metadata: AuditLogMetadata,
  Empty: AuditLogEmpty,
})

export { AuditLogViewer }
export * from "./audit-log-parts"
export * from "./audit-log-context"
