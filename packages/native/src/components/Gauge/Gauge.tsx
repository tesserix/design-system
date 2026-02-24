import React from 'react'
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface GaugeProps {
  /** Current value */
  value: number
  /** Maximum value */
  max?: number
  /** Minimum value */
  min?: number
  /** Gauge size */
  size?: number
  /** Gauge thickness */
  thickness?: number
  /** Gauge color */
  color?: string
  /** Background color */
  backgroundColor?: string
  /** Show value text */
  showValue?: boolean
  /** Value label */
  label?: string
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max = 100,
  min = 0,
  size = 150,
  thickness = 12,
  color = '#3b82f6',
  backgroundColor = '#e5e7eb',
  showValue = true,
  label,
  style,
}) => {
  const clampedValue = Math.max(min, Math.min(max, value))
  const percentage = ((clampedValue - min) / (max - min)) * 100

  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={label || 'Gauge'}
      accessibilityValue={{
        min,
        max,
        now: clampedValue,
      }}
    >
      {/* Background arc */}
      <View
        style={[
          styles.arc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: backgroundColor,
            borderBottomColor: 'transparent',
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />

      {/* Progress arc */}
      <View
        style={[
          styles.arc,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: percentage > 37.5 ? color : 'transparent',
            borderBottomColor: percentage > 75 ? color : 'transparent',
            transform: [
              { rotate: '-45deg' },
              { rotate: `${Math.min(270, (percentage / 100) * 270)}deg` },
            ],
          },
        ]}
      />

      {/* Center content */}
      {showValue && (
        <View style={styles.content}>
          <Text style={styles.valueText}>{clampedValue}</Text>
          {label && <Text style={styles.labelText}>{label}</Text>}
        </View>
      )}
    </View>
  )
}

Gauge.displayName = 'Gauge'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arc: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
    color: '#111827',
  },
  labelText: {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginTop: semanticSpacing.xs,
  },
})
