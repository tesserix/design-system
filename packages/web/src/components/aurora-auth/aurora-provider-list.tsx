"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

/** Buttons read this instead of taking a `compact` prop from every caller. */
export const AuroraProviderLayoutContext = React.createContext(false)

const COMPACT_FROM = 4

export interface AuroraProviderListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Divider caption; hidden along with the list when no provider is enabled. */
  label?: React.ReactNode
}

/**
 * Renders only the identity providers the tenant actually enabled — an empty list
 * disappears with its divider instead of leaving a dead "or sign in with".
 */
const AuroraProviderList = React.forwardRef<HTMLDivElement, AuroraProviderListProps>(
  ({ label, className, children, ...props }, ref) => {
    const enabled = React.Children.toArray(children).filter(React.isValidElement)
    if (enabled.length === 0) return null

    const compact = enabled.length >= COMPACT_FROM

    return (
      <div ref={ref} className={cn("mt-6", className)} {...props}>
        {label ? (
          <div
            className="mb-4 flex items-center gap-3 text-[0.6875rem] font-medium tracking-[0.08em] uppercase"
            style={{ color: "var(--aurora-subtle,#98A1AE)" }}
          >
            <span className="h-px flex-1" style={{ background: "var(--aurora-input-border,rgba(15,23,41,.14))" }} />
            {label}
            <span className="h-px flex-1" style={{ background: "var(--aurora-input-border,rgba(15,23,41,.14))" }} />
          </div>
        ) : null}
        <AuroraProviderLayoutContext.Provider value={compact}>
          <div className={cn("flex gap-3", compact ? "flex-wrap justify-center" : "flex-col")}>{enabled}</div>
        </AuroraProviderLayoutContext.Provider>
      </div>
    )
  }
)
AuroraProviderList.displayName = "AuroraProviderList"

export { AuroraProviderList }
