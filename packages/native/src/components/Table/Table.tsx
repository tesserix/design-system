import React from 'react'
import { View, Text, ScrollView, StyleSheet, ViewStyle, StyleProp, DimensionValue } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TableColumn<T = any> {
  /** Column key */
  key: string
  /** Column header label */
  label: string
  /** Render function for cell content */
  render?: (item: T) => React.ReactNode
  /** Column width */
  width?: number | `${number}%`
  /** Text align */
  align?: 'left' | 'center' | 'right'
}

export interface TableProps<T = any> {
  /** Table columns */
  columns: TableColumn<T>[]
  /** Table data */
  data: T[]
  /** Show header */
  showHeader?: boolean
  /** Striped rows */
  striped?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  showHeader = true,
  striped = false,
  style,
}: TableProps<T>) => {
  const getAlignStyle = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'center'
      case 'right':
        return 'flex-end'
      default:
        return 'flex-start'
    }
  }

  return (
    <ScrollView
      horizontal
      style={[styles.container, style]}
    >
      <View style={styles.table}>
        {showHeader && (
          <View style={styles.headerRow}>
            {columns.map((column, index) => (
              <View
                key={column.key}
                style={[
                  styles.headerCell,
                  {
                    width: (column.width || 100) as DimensionValue,
                    alignItems: getAlignStyle(column.align),
                  },
                  index === 0 && styles.firstCell,
                  index === columns.length - 1 && styles.lastCell,
                ]}
              >
                <Text style={styles.headerText}>{column.label}</Text>
              </View>
            ))}
          </View>
        )}

        {data.map((item, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.dataRow,
              striped && rowIndex % 2 === 1 && styles.stripedRow,
            ]}
          >
            {columns.map((column, colIndex) => (
              <View
                key={column.key}
                style={[
                  styles.dataCell,
                  {
                    width: (column.width || 100) as DimensionValue,
                    alignItems: getAlignStyle(column.align),
                  },
                  colIndex === 0 && styles.firstCell,
                  colIndex === columns.length - 1 && styles.lastCell,
                ]}
              >
                {column.render ? (
                  column.render(item)
                ) : (
                  <Text style={styles.cellText}>{item[column.key]}</Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

Table.displayName = 'Table'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
  },
  headerCell: {
    padding: semanticSpacing.md,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#374151',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  stripedRow: {
    backgroundColor: '#f9fafb',
  },
  dataCell: {
    padding: semanticSpacing.md,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: fontSize.sm,
    color: '#111827',
  },
  firstCell: {
    paddingLeft: semanticSpacing.lg,
  },
  lastCell: {
    paddingRight: semanticSpacing.lg,
  },
})
