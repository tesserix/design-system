import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface CountdownProps {
  /** Target date/time */
  targetDate: Date
  /** Callback when countdown reaches zero */
  onComplete?: () => void
  /** Show labels */
  showLabels?: boolean
  /** Custom format */
  format?: 'dhms' | 'hms' | 'ms' | 's'
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  onComplete,
  showLabels = true,
  format = 'dhms',
  style,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const completedRef = useRef(false)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  const renderUnit = (value: number, label: string, key: string) => (
    <View style={styles.unit} key={key}>
      <Text style={styles.value}>{value.toString().padStart(2, '0')}</Text>
      {showLabels && <Text style={styles.label}>{label}</Text>}
    </View>
  )

  const renderSeparator = (key: string) => (
    <Text style={styles.separator} key={key}>:</Text>
  )

  const getUnits = () => {
    const units = []

    if (format === 'dhms' || format === 'hms' || format === 'ms' || format === 's') {
      if (format === 'dhms') {
        units.push(renderUnit(timeRemaining.days, 'Days', 'days'))
        units.push(renderSeparator('sep-days'))
      }
      if (format === 'dhms' || format === 'hms') {
        units.push(renderUnit(timeRemaining.hours, 'Hours', 'hours'))
        units.push(renderSeparator('sep-hours'))
      }
      if (format === 'dhms' || format === 'hms' || format === 'ms') {
        units.push(renderUnit(timeRemaining.minutes, 'Minutes', 'minutes'))
        units.push(renderSeparator('sep-minutes'))
      }
      units.push(renderUnit(timeRemaining.seconds, 'Seconds', 'seconds'))
    }

    return units
  }

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="timer"
      accessibilityLabel={`Countdown: ${timeRemaining.days} days, ${timeRemaining.hours} hours, ${timeRemaining.minutes} minutes, ${timeRemaining.seconds} seconds`}
    >
      {getUnits()}
    </View>
  )
}

Countdown.displayName = 'Countdown'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unit: {
    alignItems: 'center',
    marginHorizontal: semanticSpacing.xs,
  },
  value: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: '#111827',
  },
  label: {
    fontSize: fontSize.xs,
    color: '#6b7280',
    marginTop: semanticSpacing.xs,
  },
  separator: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: '#111827',
    marginTop: -16,
  },
})
