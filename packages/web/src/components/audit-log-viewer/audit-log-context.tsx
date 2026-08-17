import * as React from "react"

/** Every user-visible string the viewer renders. Override to localize. */
export interface AuditLogLabels {
  title: string
  countLabel: (count: number) => string
  expand: string
  collapse: string
  empty: string
}

export const defaultAuditLogLabels: AuditLogLabels = {
  title: "Audit Log",
  countLabel: (count) => `${count} ${count === 1 ? "entry" : "entries"}`,
  expand: "Show details",
  collapse: "Hide details",
  empty: "No audit entries",
}

export interface AuditLogViewerContextValue {
  labels: AuditLogLabels
  onEntrySelect?: (entryId: string) => void
  /** Id of the viewer's heading, for `aria-labelledby` on the list. */
  headingId: string
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
