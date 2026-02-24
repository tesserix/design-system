import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface LineChartData {
  /** Data label */
  label: string
  /** Data value */
  value: number
}

export interface LineChartProps {
  /** Chart data */
  data: LineChartData[]
  /** Chart height */
  height?: number
  /** Chart width */
  width?: number
  /** Line color */
  lineColor?: string
  /** Point color */
  pointColor?: string
  /** Show points */
  showPoints?: boolean
  /** Show labels */
  showLabels?: boolean
  /** Show values */
  showValues?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  width,
  lineColor = '#3b82f6',
  pointColor = '#3b82f6',
  showPoints = true,
  showLabels = true,
  showValues = false,
  style,
}) => {
  const maxValue = Math.max(...data.map((item) => item.value), 0)
  const minValue = Math.min(...data.map((item) => item.value), 0)
  const range = maxValue - minValue || 1

  const getY = (value: number) => {
    return height - ((value - minValue) / range) * height
  }

  const pointSize = 8

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Line chart"
    >
      <View style={[styles.chartContainer, { height, width: width ?? '100%' }]}>
        {data.map((item, index) => {
          const y = getY(item.value)
          const x = (index / (data.length - 1 || 1)) * 100

          const nextItem = data[index + 1]
          const hasNextItem = !!nextItem

          return (
            <React.Fragment key={index}>
              {/* Point */}
              {showPoints && (
                <View
                  style={[
                    styles.point,
                    {
                      left: `${x}%`,
                      top: y - pointSize / 2,
                      backgroundColor: pointColor,
                      width: pointSize,
                      height: pointSize,
                      borderRadius: pointSize / 2,
                    },
                  ]}
                  accessible={true}
                  accessibilityRole="none"
                  accessibilityLabel={`${item.label}: ${item.value}`}
                />
              )}

              {/* Value label */}
              {showValues && (
                <Text
                  style={[
                    styles.valueText,
                    {
                      left: `${x}%`,
                      top: y - 25,
                    },
                  ]}
                >
                  {item.value}
                </Text>
              )}

              {/* Line segment to next point */}
              {hasNextItem && (
                <View
                  style={[
                    styles.line,
                    {
                      left: `${x}%`,
                      top: y,
                      width: `${100 / (data.length - 1)}%`,
                      height: 2,
                      backgroundColor: lineColor,
                      transform: [
                        {
                          rotate: `${Math.atan2(
                            getY(nextItem.value) - y,
                            100 / (data.length - 1)
                          )}rad`,
                        },
                      ],
                    },
                  ]}
                />
              )}
            </React.Fragment>
          )
        })}
      </View>

      {/* X-axis labels */}
      {showLabels && (
        <View style={styles.labelsContainer}>
          {data.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.label,
                {
                  left: `${(index / (data.length - 1 || 1)) * 100}%`,
                },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}

LineChart.displayName = 'LineChart'

const styles = StyleSheet.create({
  container: {
    padding: semanticSpacing.md,
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
  },
  point: {
    position: 'absolute',
    zIndex: 2,
  },
  line: {
    position: 'absolute',
    transformOrigin: 'left center',
    zIndex: 1,
  },
  valueText: {
    position: 'absolute',
    fontSize: fontSize.xs,
    color: '#111827',
    fontWeight: '600',
    transform: [{ translateX: -15 }],
  },
  labelsContainer: {
    position: 'relative',
    height: 30,
    marginTop: semanticSpacing.sm,
  },
  label: {
    position: 'absolute',
    fontSize: fontSize.xs,
    color: '#6b7280',
    textAlign: 'center',
    transform: [{ translateX: -20 }],
    width: 40,
  },
})
