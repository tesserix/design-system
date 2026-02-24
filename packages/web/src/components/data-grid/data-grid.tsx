import * as React from "react"

import { cn } from "../../lib/utils"

type Primitive = string | number | boolean | null | undefined | Date

export interface DataGridColumn<TRow extends object> {
  id: string
  header: React.ReactNode
  accessor: keyof TRow | string | ((row: TRow) => Primitive)
  render?: (value: Primitive, row: TRow) => React.ReactNode
  editable?: boolean
  className?: string
  pin?: "left" | "right"
}

export interface DataGridProps<TRow extends object> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  columns: DataGridColumn<TRow>[]
  data: TRow[]
  getRowId?: (row: TRow, index: number) => string
  enableRowSelection?: boolean
  selectedRowIds?: string[]
  onSelectedRowIdsChange?: (rowIds: string[]) => void
  onDataChange?: (data: TRow[]) => void
}

const getColumnValue = <TRow extends object>(row: TRow, column: DataGridColumn<TRow>): Primitive => {
  if (typeof column.accessor === "function") {
    return column.accessor(row)
  }
  return (row as Record<string, Primitive>)[String(column.accessor)]
}

const DataGrid = <TRow extends object>({
  className,
  columns,
  data,
  getRowId,
  enableRowSelection = true,
  selectedRowIds,
  onSelectedRowIdsChange,
  onDataChange,
  ...props
}: DataGridProps<TRow>) => {
  const [visibleColumnIds, setVisibleColumnIds] = React.useState(() => columns.map((column) => column.id))
  const [internalSelectedRowIds, setInternalSelectedRowIds] = React.useState<string[]>([])
  const [internalData, setInternalData] = React.useState(data)
  const [editingCell, setEditingCell] = React.useState<{ rowId: string; columnId: string } | null>(null)
  const [editingValue, setEditingValue] = React.useState("")

  React.useEffect(() => {
    setInternalData(data)
  }, [data])

  const resolvedGetRowId = React.useCallback(
    (row: TRow, index: number) => (getRowId ? getRowId(row, index) : String(index)),
    [getRowId]
  )

  const rows = React.useMemo(
    () => internalData.map((row, index) => ({ row, rowId: resolvedGetRowId(row, index) })),
    [internalData, resolvedGetRowId]
  )

  const controlledSelection = selectedRowIds
  const resolvedSelectedRowIds = controlledSelection ?? internalSelectedRowIds

  const updateSelection = (next: string[]) => {
    if (controlledSelection === undefined) {
      setInternalSelectedRowIds(next)
    }
    onSelectedRowIdsChange?.(next)
  }

  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumnIds((current) =>
      current.includes(columnId) ? current.filter((id) => id !== columnId) : [...current, columnId]
    )
  }

  const visibleColumns = columns.filter((column) => visibleColumnIds.includes(column.id))

  const commitEdit = () => {
    if (!editingCell) return
    const { rowId, columnId } = editingCell
    const column = columns.find((candidate) => candidate.id === columnId)
    if (!column || typeof column.accessor === "function") {
      setEditingCell(null)
      return
    }

    const rowIndex = rows.findIndex((item) => item.rowId === rowId)
    if (rowIndex < 0) {
      setEditingCell(null)
      return
    }

    const nextData = [...internalData]
    const row = nextData[rowIndex] as Record<string, unknown>
    row[column.accessor as string] = editingValue
    setInternalData(nextData)
    onDataChange?.(nextData)
    setEditingCell(null)
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Columns:</span>
        {columns.map((column) => {
          const checked = visibleColumnIds.includes(column.id)
          return (
            <label key={column.id} className="inline-flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleColumnVisibility(column.id)}
                aria-label={`Toggle ${String(column.header)} column`}
              />
              <span>{column.header}</span>
            </label>
          )
        })}
      </div>

      <div className="relative w-full overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="[&_tr]:border-b">
            <tr>
              {enableRowSelection ? (
                <th className="h-10 w-10 px-3 text-left align-middle">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={rows.length > 0 && resolvedSelectedRowIds.length === rows.length}
                    onChange={(event) => {
                      if (event.target.checked) {
                        updateSelection(rows.map((item) => item.rowId))
                      } else {
                        updateSelection([])
                      }
                    }}
                  />
                </th>
              ) : null}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    "h-10 bg-muted/30 px-3 text-left font-medium text-muted-foreground",
                    column.pin === "left" && "sticky left-0 z-[1]",
                    column.pin === "right" && "sticky right-0 z-[1]",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {rows.map(({ row, rowId }) => (
              <tr key={rowId} className="border-b">
                {enableRowSelection ? (
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      aria-label={`Select row ${rowId}`}
                      checked={resolvedSelectedRowIds.includes(rowId)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          updateSelection([...resolvedSelectedRowIds, rowId])
                        } else {
                          updateSelection(resolvedSelectedRowIds.filter((id) => id !== rowId))
                        }
                      }}
                    />
                  </td>
                ) : null}
                {visibleColumns.map((column) => {
                  const rawValue = getColumnValue(row, column)
                  const displayValue = column.render ? column.render(rawValue, row) : String(rawValue ?? "")
                  const isEditing = editingCell?.rowId === rowId && editingCell?.columnId === column.id

                  return (
                    <td
                      key={`${rowId}-${column.id}`}
                      className={cn("px-3 py-2 align-middle", column.className)}
                      onDoubleClick={() => {
                        if (!column.editable || typeof column.accessor === "function") return
                        setEditingCell({ rowId, columnId: column.id })
                        setEditingValue(String(rawValue ?? ""))
                      }}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(event) => setEditingValue(event.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault()
                              commitEdit()
                            }
                            if (event.key === "Escape") {
                              setEditingCell(null)
                            }
                          }}
                          className="h-8 w-full rounded border border-input bg-background px-2"
                        />
                      ) : (
                        displayValue
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export { DataGrid }
