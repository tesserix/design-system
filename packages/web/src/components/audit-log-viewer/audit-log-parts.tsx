import * as React from "react"
import { ChevronDown } from "@tesserix/icons/web"

import { cn } from "../../lib/utils"
import { Skeleton } from "../skeleton"
import {
  AuditLogRowProvider,
  AuditLogViewerProvider,
  defaultAuditLogLabels,
  useAuditLogExpansion,
  useAuditLogRow,
  useAuditLogViewer,
  type AuditLogLabels,
  type AuditLogSeverity,
} from "./audit-log-context"

export const AUDIT_LOG_ROW_CLASSNAME = "w-full rounded-md border p-3 text-left"

export interface AuditLogRootProps extends React.HTMLAttributes<HTMLDivElement> {
  labels?: Partial<AuditLogLabels>
  onEntrySelect?: (entryId: string) => void
  selectedEntryId?: string
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
}

/** The card container. Owns viewer-wide context for every nested part. */
const AuditLogRoot = React.forwardRef<HTMLDivElement, AuditLogRootProps>(
  (
    {
      className,
      labels,
      onEntrySelect,
      selectedEntryId,
      expandedIds,
      defaultExpandedIds,
      onExpandedChange,
      children,
      ...props
    },
    ref
  ) => {
    const mergedLabels = React.useMemo<AuditLogLabels>(
      () => ({ ...defaultAuditLogLabels, ...labels }),
      [labels]
    )
    const reactId = React.useId()
    const headingId = `${reactId}-heading`
    const { expandedIds: expanded, toggleEntry } = useAuditLogExpansion({
      expandedIds,
      defaultExpandedIds,
      onExpandedChange,
    })
    const value = React.useMemo(
      () => ({
        labels: mergedLabels,
        onEntrySelect,
        selectedEntryId,
        headingId,
        expandedIds: expanded,
        toggleEntry,
      }),
      [mergedLabels, onEntrySelect, selectedEntryId, headingId, expanded, toggleEntry]
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
  /** Plain-text row name, used to name the disclosure button. */
  entryLabel?: string
  severity?: AuditLogSeverity
}

const SEVERITY_CLASSNAMES: Record<AuditLogSeverity, string> = {
  info: "border-l-4 border-l-primary pl-1",
  warning: "border-l-4 border-l-warning pl-1",
  critical: "border-l-4 border-l-destructive pl-1",
}

/** One entry. Provides row-scoped ids so summary and detail can reference each other. */
const AuditLogRow = React.forwardRef<HTMLLIElement, AuditLogRowProps>(
  ({ className, entryId, entryLabel, severity, children, ...props }, ref) => {
    const reactId = React.useId()
    const { expandedIds, toggleEntry, labels } = useAuditLogViewer()
    const [hasDetail, setHasDetail] = React.useState(false)

    const registerDetail = React.useCallback((next: boolean) => setHasDetail(next), [])
    const toggle = React.useCallback(() => toggleEntry(entryId), [toggleEntry, entryId])

    const value = React.useMemo(
      () => ({
        entryId,
        summaryId: `${reactId}-summary`,
        detailId: `${reactId}-detail`,
        expanded: expandedIds.has(entryId),
        toggle,
        hasDetail,
        registerDetail,
        entryLabel,
      }),
      [entryId, reactId, expandedIds, toggle, hasDetail, registerDetail, entryLabel]
    )

    return (
      <AuditLogRowProvider value={value}>
        <li ref={ref} className={cn(severity && SEVERITY_CLASSNAMES[severity], className)} {...props}>
          {severity ? <span className="sr-only">{labels.severityLabel(severity)}</span> : null}
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
    const { onEntrySelect, selectedEntryId } = useAuditLogViewer()
    const { entryId, summaryId } = useAuditLogRow()
    const selected = selectedEntryId === entryId

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
        aria-current={selected ? "true" : undefined}
        className={cn(
          AUDIT_LOG_ROW_CLASSNAME,
          "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          selected && "border-primary bg-accent",
          className
        )}
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
    <div ref={ref} className={cn("mt-1 break-words text-xs text-muted-foreground", className)} {...props} />
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

export interface AuditLogDisclosureProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-expanded" | "aria-controls"> {}

/**
 * Toggles the row's detail. A SIBLING of `AuditLogSummary`, never a child —
 * HTML forbids a button inside a button, and the summary is itself a button
 * whenever the viewer tracks selection.
 */
const AuditLogDisclosure = React.forwardRef<HTMLButtonElement, AuditLogDisclosureProps>(
  ({ className, ...props }, ref) => {
    const { labels } = useAuditLogViewer()
    const { detailId, expanded, toggle, entryLabel } = useAuditLogRow()
    const action = expanded ? labels.collapse : labels.expand

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={expanded}
        aria-controls={detailId}
        aria-label={entryLabel ? `${action}: ${entryLabel}` : action}
        onClick={toggle}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <ChevronDown
          aria-hidden="true"
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
        />
      </button>
    )
  }
)
AuditLogDisclosure.displayName = "AuditLogDisclosure"

/**
 * The row's collapsible detail. Unmounts when collapsed, so hidden content
 * stays out of the accessibility tree entirely.
 */
const AuditLogDetail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { detailId, summaryId, expanded, registerDetail } = useAuditLogRow()

    React.useEffect(() => {
      registerDetail(true)
      return () => registerDetail(false)
    }, [registerDetail])

    if (!expanded) {
      return null
    }

    return (
      <div
        ref={ref}
        id={detailId}
        role="region"
        aria-labelledby={summaryId}
        className={cn("mt-2 break-words rounded-md border bg-muted/40 p-3 text-xs", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AuditLogDetail.displayName = "AuditLogDetail"

export interface AuditLogSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Placeholder rows to render. Default 3. */
  rows?: number
}

/** Placeholder rows for a viewer whose entries have not arrived yet. */
const AuditLogSkeleton = React.forwardRef<HTMLDivElement, AuditLogSkeletonProps>(
  ({ className, rows = 3, ...props }, ref) => (
    <div ref={ref} role="status" aria-busy="true" className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          data-slot="audit-log-skeleton-row"
          className={cn(AUDIT_LOG_ROW_CLASSNAME, "space-y-2")}
        >
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  )
)
AuditLogSkeleton.displayName = "AuditLogSkeleton"

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
  AuditLogDisclosure,
  AuditLogDetail,
  AuditLogSkeleton,
}
