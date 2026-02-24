import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface DataGridColumn {
  id: string
  header: string
  accessor: string
  sortable?: boolean
  width?: number
}

export interface DataGridRow {
  id: string
  [key: string]: any
}

export interface DataGridProps {
  /** Column definitions */
  columns: DataGridColumn[]
  /** Data rows */
  data: DataGridRow[]
  /** Callback when row is pressed */
  onRowPress?: (row: DataGridRow) => void
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

type SortDirection = 'asc' | 'desc' | null

/**
 * DataGrid component - Advanced table with sorting and filtering
 *
 * @example
 * ```tsx
 * <DataGrid
 *   columns={[
 *     { id: 'name', header: 'Name', accessor: 'name', sortable: true },
 *     { id: 'email', header: 'Email', accessor: 'email' }
 *   ]}
 *   data={[
 *     { id: '1', name: 'John', email: 'john@example.com' }
 *   ]}
 * />
 * ```
 */
export const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  onRowPress,
  style,
  testID,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId)
    if (!column?.sortable) return

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    const column = columns.find((col) => col.id === sortColumn)
    if (!column) return data

    return [...data].sort((a, b) => {
      const aVal = a[column.accessor]
      const bVal = b[column.accessor]

      if (aVal === bVal) return 0

      const comparison = aVal < bVal ? -1 : 1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection, columns])

  const containerStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  }

  const tableStyle: ViewStyle = {
    backgroundColor: '#ffffff',
  }

  const headerRowStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  }

  const headerCellStyle: ViewStyle = {
    padding: spacing[3],
    flex: 1,
    minWidth: 100,
  }

  const headerTextStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#374151',
    textTransform: 'uppercase',
  }

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  }

  const cellStyle: ViewStyle = {
    padding: spacing[3],
    flex: 1,
    minWidth: 100,
  }

  const cellTextStyle: TextStyle = {
    fontSize: fontSize.base,
    color: '#111827',
  }

  const sortIndicatorStyle: TextStyle = {
    fontSize: fontSize.xs,
    marginLeft: spacing[1],
    color: '#6b7280',
  }

  return (
    <View style={[containerStyle, style]} testID={testID} accessible accessibilityRole="list">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={tableStyle}>
          {/* Header */}
          <View style={headerRowStyle} accessible accessibilityRole="summary">
            {columns.map((column) => (
              <TouchableOpacity
                key={column.id}
                style={[headerCellStyle, column.width ? { width: column.width } : undefined]}
                onPress={() => handleSort(column.id)}
                disabled={!column.sortable}
                accessible
                accessibilityRole="button"
                accessibilityLabel={column.header}
                accessibilityHint={column.sortable ? 'Tap to sort' : undefined}
                accessibilityState={{ disabled: !column.sortable }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={headerTextStyle}>{column.header}</Text>
                  {column.sortable && sortColumn === column.id && (
                    <Text style={sortIndicatorStyle}>
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Rows */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedData.map((row) => (
              <TouchableOpacity
                key={row.id}
                style={rowStyle}
                onPress={() => onRowPress?.(row)}
                disabled={!onRowPress}
                accessible
                accessibilityRole={onRowPress ? 'button' : 'summary'}
                accessibilityState={{ disabled: !onRowPress }}
              >
                {columns.map((column) => (
                  <View
                    key={column.id}
                    style={[cellStyle, column.width ? { width: column.width } : undefined]}
                  >
                    <Text style={cellTextStyle} numberOfLines={1}>
                      {String(row[column.accessor] ?? '')}
                    </Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

DataGrid.displayName = 'DataGrid'
