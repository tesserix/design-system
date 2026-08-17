import * as React from "react"

import {
  AuditLogCount,
  AuditLogDetail,
  AuditLogDisclosure,
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
import { defaultAuditLogLabels, type AuditLogLabels, type AuditLogSeverity } from "./audit-log-context"

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target?: string
  timestamp: string
  metadata?: string
  /** Opaque, consumer-defined id of the system this entry came from. */
  source?: string
  /**
   * ISO 8601 form of `timestamp`, for `<time dateTime>`. Omit it and no
   * attribute is emitted — an invalid `dateTime` is worse than none.
   */
  dateTime?: string
  /** Collapsible detail for this entry. Renders a disclosure when present. */
  detail?: React.ReactNode
  /** Severity level for this entry. Rendered as a colored left border and sr-only text. */
  severity?: AuditLogSeverity
}

export interface AuditLogViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  entries: AuditLogEntry[]
  emptyMessage?: string
  onEntrySelect?: (entryId: string) => void
  /** Id of the selected entry. Marks that row `aria-current` and tints it. */
  selectedEntryId?: string
  /** Renders the label for an entry's `source`. Defaults to the raw id. */
  renderSource?: (source: string) => React.ReactNode
  /** Renders an entry's `metadata`. Defaults to the raw string. */
  renderMetadata?: (metadata: string) => React.ReactNode
  /**
   * Renders the entry's headline. Use it to localize word order, which
   * string substitution cannot do.
   */
  renderSummary?: (entry: AuditLogEntry) => React.ReactNode
  /** Overrides for user-visible strings. Unspecified keys keep their English default. */
  labels?: Partial<AuditLogLabels>
  /** Heading level for the viewer title. Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Builds collapsible detail for entries that carry none of their own. */
  renderDetail?: (entry: AuditLogEntry) => React.ReactNode
  /** Expanded entry ids (controlled). */
  expandedIds?: string[]
  /** Initially expanded entry ids (uncontrolled). */
  defaultExpandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
}

const AuditLogViewerRoot = React.forwardRef<HTMLDivElement, AuditLogViewerProps>(
  (
    {
      className,
      entries,
      emptyMessage,
      onEntrySelect,
      selectedEntryId,
      renderSource,
      renderMetadata,
      renderSummary,
      labels,
      headingLevel = 3,
      renderDetail,
      expandedIds,
      defaultExpandedIds,
      onExpandedChange,
      ...props
    },
    ref
  ) => {
    const mergedCountLabel = labels?.countLabel ?? defaultAuditLogLabels.countLabel

    return (
      <AuditLogRoot
        ref={ref}
        className={className}
        onEntrySelect={onEntrySelect}
        selectedEntryId={selectedEntryId}
        labels={labels}
        expandedIds={expandedIds}
        defaultExpandedIds={defaultExpandedIds}
        onExpandedChange={onExpandedChange}
        {...props}
      >
        <AuditLogHeader>
          <AuditLogTitle level={headingLevel} />
          <AuditLogCount>{mergedCountLabel(entries.length)}</AuditLogCount>
        </AuditLogHeader>

        {entries.length === 0 ? (
          <AuditLogEmpty>{emptyMessage}</AuditLogEmpty>
        ) : (
          <AuditLogList>
            {entries.map((entry) => {
              const detail = entry.detail ?? renderDetail?.(entry)
              const entryLabel = `${entry.actor} ${entry.action}${entry.target ? ` ${entry.target}` : ""}`

              return (
                <AuditLogRow
                  key={entry.id}
                  entryId={entry.id}
                  entryLabel={entryLabel}
                  severity={entry.severity}
                >
                  <div className="flex items-start gap-2">
                    <AuditLogSummary className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium">
                          {renderSummary ? renderSummary(entry) : entryLabel}
                        </p>
                        <div className="flex items-center gap-2">
                          {entry.source ? (
                            <AuditLogSource>
                              {renderSource ? renderSource(entry.source) : entry.source}
                            </AuditLogSource>
                          ) : null}
                          <AuditLogTime dateTime={entry.dateTime}>{entry.timestamp}</AuditLogTime>
                        </div>
                      </div>
                      {entry.metadata ? (
                        <AuditLogMetadata>
                          {renderMetadata ? renderMetadata(entry.metadata) : entry.metadata}
                        </AuditLogMetadata>
                      ) : null}
                    </AuditLogSummary>
                    {detail ? <AuditLogDisclosure /> : null}
                  </div>
                  {detail ? <AuditLogDetail>{detail}</AuditLogDetail> : null}
                </AuditLogRow>
              )
            })}
          </AuditLogList>
        )}
      </AuditLogRoot>
    )
  }
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
  Disclosure: AuditLogDisclosure,
  Detail: AuditLogDetail,
})

export { AuditLogViewer }
export * from "./audit-log-parts"
export * from "./audit-log-context"
