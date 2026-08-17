import * as React from "react"

export type AuditLogSeverity = "info" | "warning" | "critical"

/** Every user-visible string the viewer renders. Override to localize. */
export interface AuditLogLabels {
  title: string
  countLabel: (count: number) => string
  expand: string
  collapse: string
  empty: string
  severityLabel: (severity: AuditLogSeverity) => string
  /** Announced by the loading skeleton's live region. */
  loading: string
}

export const defaultAuditLogLabels: AuditLogLabels = {
  title: "Audit Log",
  countLabel: (count) => `${count} ${count === 1 ? "entry" : "entries"}`,
  expand: "Show details",
  collapse: "Hide details",
  empty: "No audit entries",
  loading: "Loading audit entries",
  severityLabel: (severity) =>
    ({ info: "Info", warning: "Warning", critical: "Critical" })[severity],
}

export interface AuditLogViewerContextValue {
  labels: AuditLogLabels
  onEntrySelect?: (entryId: string) => void
  /** Id of the viewer's heading, for `aria-labelledby` on the list. */
  headingId: string
  /** Id of the currently selected entry, if the surface tracks selection. */
  selectedEntryId?: string
  expandedIds: ReadonlySet<string>
  toggleEntry: (entryId: string) => void
}

const AuditLogViewerContext = React.createContext<AuditLogViewerContextValue | undefined>(undefined)

export const AuditLogViewerProvider = AuditLogViewerContext.Provider

export function useAuditLogViewer(): AuditLogViewerContextValue {
  const context = React.useContext(AuditLogViewerContext)
  if (!context) {
    throw new Error("AuditLog parts must be used within AuditLogRoot")
  }
  return context
}

export interface AuditLogRowContextValue {
  entryId: string
  summaryId: string
  detailId: string
  expanded: boolean
  toggle: () => void
  /** Plain-text name of the row, for the disclosure's accessible name. */
  entryLabel?: string
}

const AuditLogRowContext = React.createContext<AuditLogRowContextValue | undefined>(undefined)

export const AuditLogRowProvider = AuditLogRowContext.Provider

export function useAuditLogRow(): AuditLogRowContextValue {
  const context = React.useContext(AuditLogRowContext)
  if (!context) {
    throw new Error("AuditLog row parts must be used within AuditLogRow")
  }
  return context
}

export interface UseAuditLogExpansionOptions {
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
}

export interface AuditLogExpansion {
  expandedIds: ReadonlySet<string>
  toggleEntry: (entryId: string) => void
}

/**
 * Multiple-open expansion state. Controlled when `expandedIds` is passed;
 * otherwise self-managed from `defaultExpandedIds`.
 */
export function useAuditLogExpansion({
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
}: UseAuditLogExpansionOptions): AuditLogExpansion {
  const [uncontrolled, setUncontrolled] = React.useState<ReadonlySet<string>>(
    () => new Set(defaultExpandedIds ?? [])
  )
  const isControlled = expandedIds !== undefined
  const controlled = React.useMemo(() => new Set(expandedIds ?? []), [expandedIds])
  const current = isControlled ? controlled : uncontrolled

  const toggleEntry = React.useCallback(
    (entryId: string) => {
      const next = new Set(current)
      if (next.has(entryId)) {
        next.delete(entryId)
      } else {
        next.add(entryId)
      }

      if (!isControlled) {
        setUncontrolled(next)
      }
      onExpandedChange?.(Array.from(next))
    },
    [current, isControlled, onExpandedChange]
  )

  return { expandedIds: current, toggleEntry }
}
