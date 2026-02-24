import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface DashboardCardProps {
  /** Card title */
  title: string
  /** Main value to display */
  value: string | number
  /** Change indicator (positive or negative) */
  change?: {
    value: number
    label?: string
  }
  /** Icon to display */
  icon?: string
  /** Card color */
  color?: string
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * DashboardCard component - Dashboard stat widget with title, value, change indicator
 *
 * @example
 * ```tsx
 * <DashboardCard
 *   title="Total Revenue"
 *   value="$45,231"
 *   change={{ value: 12.5, label: "vs last month" }}
 *   icon="💰"
 *   color="#3b82f6"
 * />
 * ```
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  change,
  icon,
  color = '#3b82f6',
  style,
  testID,
}) => {
  const isPositiveChange = change && change.value >= 0

  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[4],
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: color,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  }

  const titleStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize['2xl'],
  }

  const valueStyle: TextStyle = {
    fontSize: fontSize['3xl'],
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[2],
  }

  const changeContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  }

  const changeValueStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: isPositiveChange ? '#10b981' : '#ef4444',
    marginRight: spacing[1],
  }

  const changeLabelStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}: ${value}${change ? `, ${change.value >= 0 ? 'up' : 'down'} ${Math.abs(change.value)}%` : ''}`}
    >
      <View style={headerStyle}>
        <Text style={titleStyle}>{title}</Text>
        {icon && <Text style={iconStyle} accessible={false}>{icon}</Text>}
      </View>

      <Text style={valueStyle}>{value}</Text>

      {change && (
        <View style={changeContainerStyle}>
          <Text style={changeValueStyle}>
            {isPositiveChange ? '↑' : '↓'} {Math.abs(change.value)}%
          </Text>
          {change.label && <Text style={changeLabelStyle}>{change.label}</Text>}
        </View>
      )}
    </View>
  )
}

DashboardCard.displayName = 'DashboardCard'
