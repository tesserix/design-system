import * as React from "react"

import { cn } from "../../lib/utils"

type Primitive = string | number | boolean | null | undefined | Date

export interface DataTableColumn<TRow> {
  id: string
  header: React.ReactNode
  accessor?: keyof TRow | ((row: TRow) => Primitive)
  sortable?: boolean
  className?: string
  render?: (row: TRow) => React.ReactNode
}

export interface DataTableProps<TRow extends object>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  columns: DataTableColumn<TRow>[]
  data: TRow[]
  searchPlaceholder?: string
  emptyMessage?: string
  pageSizeOptions?: number[]
  defaultPageSize?: number
  columnFiltersEnabled?: boolean
  enableRowSelection?: boolean
  selectedRowIds?: string[]
  onSelectedRowIdsChange?: (rowIds: string[]) => void
  getRowId?: (row: TRow, index: number) => string
}

const toSortableValue = (value: Primitive): string | number => {
  if (value == null) return ""
  if (value instanceof Date) return value.getTime()
  if (typeof value === "boolean") return value ? 1 : 0
  return value
}

const getColumnValue = <TRow extends object>(row: TRow, column: DataTableColumn<TRow>) => {
  if (column.accessor == null) return undefined
  if (typeof column.accessor === "function") return column.accessor(row)
  return (row as Record<string, unknown>)[column.accessor as string] as Primitive
}

const DataTable = <TRow extends object>({
  className,
  columns,
  data,
  searchPlaceholder = "Search rows...",
  emptyMessage = "No matching records found.",
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  columnFiltersEnabled = false,
  enableRowSelection = false,
  selectedRowIds,
  onSelectedRowIdsChange,
  getRowId,
  ...props
}: DataTableProps<TRow>) => {
  const [query, setQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(defaultPageSize)
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({})
  const [internalSelectedRowIds, setInternalSelectedRowIds] = React.useState<string[]>([])

  const searchableColumns = React.useMemo(
    () => columns.filter((column) => column.accessor != null),
    [columns]
  )

  const resolvedGetRowId = React.useCallback(
    (row: TRow, index: number) => (getRowId ? getRowId(row, index) : String(index)),
    [getRowId]
  )

  const resolvedSelectedRowIds = selectedRowIds ?? internalSelectedRowIds
  const selectedRowIdSet = React.useMemo(() => new Set(resolvedSelectedRowIds), [resolvedSelectedRowIds])

  const updateSelectedRowIds = React.useCallback(
    (nextIds: string[]) => {
      if (selectedRowIds === undefined) {
        setInternalSelectedRowIds(nextIds)
      }
      onSelectedRowIdsChange?.(nextIds)
    },
    [selectedRowIds, onSelectedRowIdsChange]
  )

  const dataWithIds = React.useMemo(
    () => data.map((row, index) => ({ row, rowId: resolvedGetRowId(row, index) })),
    [data, resolvedGetRowId]
  )

  const filteredRows = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return dataWithIds.filter(({ row }) => {
      const matchesGlobalQuery =
        !normalizedQuery ||
        searchableColumns.some((column) => {
          const value = getColumnValue(row, column)
          return String(value ?? "").toLowerCase().includes(normalizedQuery)
        })

      if (!matchesGlobalQuery) return false

      if (!columnFiltersEnabled) return true

      return columns.every((column) => {
        const filterValue = (columnFilters[column.id] ?? "").trim().toLowerCase()
        if (!filterValue) return true
        const cellValue = getColumnValue(row, column)
        return String(cellValue ?? "").toLowerCase().includes(filterValue)
      })
    })
  }, [columnFilters, columnFiltersEnabled, columns, dataWithIds, query, searchableColumns])

  const sortedRows = React.useMemo(() => {
    if (!sortBy) return filteredRows
    const sortColumn = columns.find((column) => column.id === sortBy)
    if (!sortColumn || sortColumn.accessor == null) return filteredRows

    const sorted = [...filteredRows]
    sorted.sort((a, b) => {
      const aValue = toSortableValue(getColumnValue(a.row, sortColumn))
      const bValue = toSortableValue(getColumnValue(b.row, sortColumn))

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [columns, filteredRows, sortBy, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const clampedPage = Math.min(page, totalPages)

  React.useEffect(() => {
    if (page !== clampedPage) {
      setPage(clampedPage)
    }
  }, [page, clampedPage])

  const paginatedRows = React.useMemo(() => {
    const start = (clampedPage - 1) * pageSize
    return sortedRows.slice(start, start + pageSize)
  }, [clampedPage, pageSize, sortedRows])

  const allVisibleRowIds = React.useMemo(() => sortedRows.map((item) => item.rowId), [sortedRows])
  const allVisibleSelected =
    allVisibleRowIds.length > 0 && allVisibleRowIds.every((rowId) => selectedRowIdSet.has(rowId))
  const someVisibleSelected = allVisibleRowIds.some((rowId) => selectedRowIdSet.has(rowId))

  return (
    <div className={cn("w-full space-y-4", className)} {...props}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          role="searchbox"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder={searchPlaceholder}
          className={cn(
            "h-10 w-full max-w-sm rounded-lg border border-input bg-background px-3 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        />

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Rows per page
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value))
              setPage(1)
            }}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative w-full overflow-auto rounded-lg border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr>
              {enableRowSelection ? (
                <th className="h-11 w-12 px-3 text-left align-middle">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allVisibleSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = !allVisibleSelected && someVisibleSelected
                      }
                    }}
                    onChange={(event) => {
                      if (event.target.checked) {
                        updateSelectedRowIds(Array.from(new Set([...resolvedSelectedRowIds, ...allVisibleRowIds])))
                      } else {
                        updateSelectedRowIds(resolvedSelectedRowIds.filter((rowId) => !allVisibleRowIds.includes(rowId)))
                      }
                    }}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const isSorted = sortBy === column.id
                const sortable = column.sortable && column.accessor != null
                const nextDirection = isSorted && sortDirection === "asc" ? "desc" : "asc"

                return (
                  <th
                    key={column.id}
                    className={cn(
                      "h-11 px-4 text-left align-middle font-medium text-muted-foreground",
                      column.className
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => {
                          setSortBy(column.id)
                          setSortDirection(nextDirection)
                        }}
                      >
                        <span>{column.header}</span>
                        <span className="text-xs">
                          {isSorted ? (sortDirection === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
            {columnFiltersEnabled ? (
              <tr>
                {enableRowSelection ? <th className="px-3 py-2" /> : null}
                {columns.map((column) => (
                  <th key={`${column.id}-filter`} className={cn("px-4 py-2", column.className)}>
                    {column.accessor != null ? (
                      <input
                        type="text"
                        value={columnFilters[column.id] ?? ""}
                        onChange={(event) => {
                          setColumnFilters((current) => ({
                            ...current,
                            [column.id]: event.target.value,
                          }))
                          setPage(1)
                        }}
                        placeholder={`Filter ${String(column.header).toLowerCase()}`}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            ) : null}
          </thead>

          <tbody className="[&_tr:last-child]:border-0">
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="p-8 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRows.map(({ row, rowId }, index) => (
                <tr
                  key={rowId || index}
                  data-state={selectedRowIdSet.has(rowId) ? "selected" : undefined}
                  className="border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/50"
                >
                  {enableRowSelection ? (
                    <td className="p-3 align-middle">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${index + 1}`}
                        checked={selectedRowIdSet.has(rowId)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            updateSelectedRowIds([...resolvedSelectedRowIds, rowId])
                          } else {
                            updateSelectedRowIds(resolvedSelectedRowIds.filter((selectedId) => selectedId !== rowId))
                          }
                        }}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={column.id} className={cn("p-4 align-middle", column.className)}>
                      {column.render ? column.render(row) : String(getColumnValue(row, column) ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedRows.length} of {sortedRows.length} row(s)
          {enableRowSelection ? ` • ${resolvedSelectedRowIds.length} selected` : ""}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={clampedPage === 1}
            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {clampedPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={clampedPage >= totalPages}
            className="rounded-md border px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export { DataTable }
