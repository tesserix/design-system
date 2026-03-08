'use client';

import * as React from 'react'
import { cn } from '../../lib/utils'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T, index: number) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
  isPrimary?: boolean
  isSecondary?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T, index: number) => string
  className?: string
  emptyMessage?: string
  isLoading?: boolean
  mobileCardClassName?: string
  onRowClick?: (item: T, index: number) => void
  renderMobileActions?: (item: T, index: number) => React.ReactNode
}

function ResponsiveTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  className,
  emptyMessage = 'No data available',
  isLoading = false,
  mobileCardClassName,
  onRowClick,
  renderMobileActions,
}: ResponsiveTableProps<T>) {
  const primaryColumn = columns.find(col => col.isPrimary)
  const secondaryColumn = columns.find(col => col.isSecondary)

  const getValue = (item: T, col: Column<T>, index: number): React.ReactNode => {
    if (col.render) {
      return col.render(item, index)
    }
    const value = item[col.key as keyof T]
    if (value === null || value === undefined) return '-'
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((_, i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-border rounded-lg">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className={cn(
                  'hover:bg-muted/50 transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(item, index)}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn('px-4 py-3 text-sm', col.className)}
                  >
                    {getValue(item, col, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {data.map((item, index) => (
          <div
            key={keyExtractor(item, index)}
            className={cn(
              'bg-card border border-border rounded-lg p-4',
              onRowClick && 'cursor-pointer active:bg-muted/50',
              mobileCardClassName
            )}
            onClick={() => onRowClick?.(item, index)}
          >
            {(primaryColumn || secondaryColumn) && (
              <div className="mb-3 pb-3 border-b border-border">
                {primaryColumn && (
                  <div className="font-semibold text-foreground">
                    {getValue(item, primaryColumn, index)}
                  </div>
                )}
                {secondaryColumn && (
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {getValue(item, secondaryColumn, index)}
                  </div>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {columns
                .filter(col => !col.hideOnMobile && !col.isPrimary && !col.isSecondary)
                .map((col, colIndex) => (
                  <div key={colIndex} className="min-w-0">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      {col.header}
                    </div>
                    <div className="text-sm text-foreground truncate">
                      {getValue(item, col, index)}
                    </div>
                  </div>
                ))}
            </div>
            {renderMobileActions && (
              <div className="mt-4 pt-3 border-t border-border flex gap-2">
                {renderMobileActions(item, index)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SimpleTableWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0', className)}>
      <div className="min-w-full inline-block align-middle">
        {children}
      </div>
    </div>
  )
}

export { ResponsiveTable, SimpleTableWrapper }
