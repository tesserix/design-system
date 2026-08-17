import * as React from "react"

import { cn } from "../../lib/utils"
import {
  AuditLogRowProvider,
  AuditLogViewerProvider,
  defaultAuditLogLabels,
  useAuditLogRow,
  useAuditLogViewer,
  type AuditLogLabels,
} from "./audit-log-context"

export const AUDIT_LOG_ROW_CLASSNAME = "w-full rounded-md border p-3 text-left"

export interface AuditLogRootProps extends React.HTMLAttributes<HTMLDivElement> {
  labels?: Partial<AuditLogLabels>
  onEntrySelect?: (entryId: string) => void
}

/** The card container. Owns viewer-wide context for every nested part. */
const AuditLogRoot = React.forwardRef<HTMLDivElement, AuditLogRootProps>(
  ({ className, labels, onEntrySelect, children, ...props }, ref) => {
    const mergedLabels = React.useMemo<AuditLogLabels>(
      () => ({ ...defaultAuditLogLabels, ...labels }),
      [labels]
    )
    const reactId = React.useId()
    const headingId = `${reactId}-heading`
    const value = React.useMemo(
      () => ({ labels: mergedLabels, onEntrySelect, headingId }),
      [mergedLabels, onEntrySelect, headingId]
    )

    return (
      <AuditLogViewerProvider value={value}>
        <div ref={ref} className={cn("space-y-3 rounded-xl border bg-card p-4", className)} {...props}>
          {children}
        </div>
      </AuditLogViewerProvider>
    )
  }
)
AuditLogRoot.displayName = "AuditLogRoot"

const AuditLogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between", className)} {...props} />
  )
)
AuditLogHeader.displayName = "AuditLogHeader"

export interface AuditLogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading level. Default 3 — set it to keep a consuming page's outline correct. */
  level?: 2 | 3 | 4 | 5 | 6
}

const AuditLogTitle = React.forwardRef<HTMLHeadingElement, AuditLogTitleProps>(
  ({ className, level = 3, children, ...props }, ref) => {
    const { labels, headingId } = useAuditLogViewer()
    const Heading = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6"

    return (
      <Heading ref={ref} id={headingId} className={cn("text-sm font-semibold", className)} {...props}>
        {children ?? labels.title}
      </Heading>
    )
  }
)
AuditLogTitle.displayName = "AuditLogTitle"

const AuditLogCount = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogCount.displayName = "AuditLogCount"

const AuditLogList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => {
    const { headingId } = useAuditLogViewer()
    return (
      <ol ref={ref} aria-labelledby={headingId} className={cn("space-y-2", className)} {...props} />
    )
  }
)
AuditLogList.displayName = "AuditLogList"

export interface AuditLogRowProps extends React.LiHTMLAttributes<HTMLLIElement> {
  entryId: string
}

/** One entry. Provides row-scoped ids so summary and detail can reference each other. */
const AuditLogRow = React.forwardRef<HTMLLIElement, AuditLogRowProps>(
  ({ className, entryId, children, ...props }, ref) => {
    const reactId = React.useId()
    const value = React.useMemo(
      () => ({ entryId, summaryId: `${reactId}-summary` }),
      [entryId, reactId]
    )

    return (
      <AuditLogRowProvider value={value}>
        <li ref={ref} className={className} {...props}>
          {children}
        </li>
      </AuditLogRowProvider>
    )
  }
)
AuditLogRow.displayName = "AuditLogRow"

/**
 * The entry's main line. Renders a `<button>` only when the viewer has an
 * `onEntrySelect`; otherwise a plain `<div>`, so a viewer with no detail view
 * exposes no focusable control that does nothing.
 */
const AuditLogSummary = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    const { onEntrySelect } = useAuditLogViewer()
    const { entryId, summaryId } = useAuditLogRow()

    if (!onEntrySelect) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          id={summaryId}
          className={cn(AUDIT_LOG_ROW_CLASSNAME, className)}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        id={summaryId}
        type="button"
        className={cn(AUDIT_LOG_ROW_CLASSNAME, "hover:bg-accent", className)}
        onClick={() => onEntrySelect(entryId)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
AuditLogSummary.displayName = "AuditLogSummary"

const AuditLogTime = React.forwardRef<HTMLTimeElement, React.TimeHTMLAttributes<HTMLTimeElement>>(
  ({ className, ...props }, ref) => (
    <time ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogTime.displayName = "AuditLogTime"

const AuditLogSource = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogSource.displayName = "AuditLogSource"

const AuditLogMetadata = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-1 text-xs text-muted-foreground", className)} {...props} />
  )
)
AuditLogMetadata.displayName = "AuditLogMetadata"

const AuditLogEmpty = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { labels } = useAuditLogViewer()
    return (
      <p
        ref={ref}
        className={cn("rounded-md border border-dashed p-3 text-sm text-muted-foreground", className)}
        {...props}
      >
        {children ?? labels.empty}
      </p>
    )
  }
)
AuditLogEmpty.displayName = "AuditLogEmpty"

export {
  AuditLogRoot,
  AuditLogHeader,
  AuditLogTitle,
  AuditLogCount,
  AuditLogList,
  AuditLogRow,
  AuditLogSummary,
  AuditLogTime,
  AuditLogSource,
  AuditLogMetadata,
  AuditLogEmpty,
}
