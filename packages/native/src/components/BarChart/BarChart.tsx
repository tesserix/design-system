import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface BarChartData {
  /** Data label */
  label: string
  /** Data value */
  value: number
  /** Bar color */
  color?: string
}

export interface BarChartProps {
  /** Chart data */
  data: BarChartData[]
  /** Chart height */
  height?: number
  /** Show values on bars */
  showValues?: boolean
  /** Show labels */
  showLabels?: boolean
  /** Animate bars */
  animated?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showValues = true,
  showLabels = true,
  animated = true,
  style,
}) => {
  void animated
  const maxValue = Math.max(...data.map((item) => item.value), 0)
  const defaultColor = '#3b82f6'

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Bar chart"
    >
      <View style={[styles.chartContainer, { height }]}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * height : 0
          const barColor = item.color || defaultColor

          return (
            <View
              key={index}
              style={styles.barColumn}
              accessible={true}
              accessibilityRole="none"
              accessibilityLabel={`${item.label}: ${item.value}`}
            >
              <View style={styles.barWrapper}>
                {showValues && (
                  <Text style={styles.valueText}>{item.value}</Text>
                )}
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              {showLabels && (
                <Text
                  style={styles.label}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.label}
                </Text>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

BarChart.displayName = 'BarChart'

const styles = StyleSheet.create({
  container: {
    padding: semanticSpacing.md,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: semanticSpacing.sm,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  valueText: {
    fontSize: fontSize.sm,
    color: '#111827',
    fontWeight: '600',
    marginBottom: semanticSpacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    color: '#6b7280',
    marginTop: semanticSpacing.xs,
    textAlign: 'center',
  },
})
