import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface MetricCardProps {
  /** Icon to display */
  icon?: string
  /** Metric value */
  value: string | number
  /** Metric label */
  label: string
  /** Trend indicator */
  trend?: 'up' | 'down' | 'neutral'
  /** Trend value */
  trendValue?: string
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * MetricCard component - KPI metric display with icon, value, label, trend
 *
 * @example
 * ```tsx
 * <MetricCard
 *   icon="📈"
 *   value="24.5K"
 *   label="Total Users"
 *   trend="up"
 *   trendValue="+12.5%"
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  trend,
  trendValue,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  }

  const contentStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const leftContentStyle: ViewStyle = {
    flex: 1,
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize['3xl'],
    marginBottom: spacing[2],
  }

  const valueStyle: TextStyle = {
    fontSize: fontSize['2xl'],
    fontWeight: String(fontWeight.bold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[1],
  }

  const labelStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginBottom: spacing[2],
  }

  const trendContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return '#10b981'
      case 'down':
        return '#ef4444'
      case 'neutral':
      default:
        return '#6b7280'
    }
  }

  const trendIconStyle: TextStyle = {
    fontSize: fontSize.base,
    color: getTrendColor(),
    marginRight: spacing[1],
  }

  const trendValueStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: getTrendColor(),
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      case 'neutral':
      default:
        return '→'
    }
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${label}: ${value}${trendValue ? `, trend ${trend}, ${trendValue}` : ''}`}
    >
      <View style={contentStyle}>
        <View style={leftContentStyle}>
          {icon && <Text style={iconStyle} accessible={false}>{icon}</Text>}
          <Text style={valueStyle}>{value}</Text>
          <Text style={labelStyle}>{label}</Text>
          {trend && trendValue && (
            <View style={trendContainerStyle}>
              <Text style={trendIconStyle}>{getTrendIcon()}</Text>
              <Text style={trendValueStyle}>{trendValue}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

MetricCard.displayName = 'MetricCard'
