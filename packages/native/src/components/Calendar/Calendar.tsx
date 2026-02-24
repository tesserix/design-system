import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface CalendarProps {
  /** Selected date */
  value?: Date
  /** Callback when date is selected */
  onSelect?: (date: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onSelect,
  minDate,
  maxDate,
  style,
}) => {
  const [selectedDate, setSelectedDate] = useState(value || null)
  const [displayMonth, setDisplayMonth] = useState(
    value ? value.getMonth() : new Date().getMonth()
  )
  const [displayYear, setDisplayYear] = useState(
    value ? value.getFullYear() : new Date().getFullYear()
  )

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }

  const handleSelectDate = (day: number) => {
    const nextSelectedDate = new Date(displayYear, displayMonth, day)
    if (!isDateDisabled(nextSelectedDate)) {
      setSelectedDate(nextSelectedDate)
      onSelect?.(nextSelectedDate)
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayMonth, displayYear)
    const firstDay = getFirstDayOfMonth(displayMonth, displayYear)
    const days = []

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayYear, displayMonth, day)
      const isSelected = Boolean(selectedDate && isSameDay(date, selectedDate))
      const isDisabled = isDateDisabled(date)
      const isToday = isSameDay(date, new Date())

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}
          onPress={() => handleSelectDate(day)}
          disabled={isDisabled}
          accessibilityRole="button"
          accessibilityLabel={`${MONTHS[displayMonth]} ${day}, ${displayYear}`}
          accessibilityState={{ selected: isSelected, disabled: isDisabled }}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isDisabled && styles.disabledDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      )
    }

    return days
  }

  return (
    <View style={[styles.container, style]} accessibilityRole="none">
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {MONTHS[displayMonth]} {displayYear}
        </Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {DAYS.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysGrid}>{renderCalendarDays()}</View>
    </View>
  )
}

Calendar.displayName = 'Calendar'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: semanticSpacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: semanticSpacing.md,
  },
  navButton: {
    padding: semanticSpacing.sm,
  },
  navText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#111827',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: semanticSpacing.xs,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: semanticSpacing.xs,
  },
  weekDayText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: '#6b7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: fontSize.sm,
    color: '#111827',
  },
  selectedDay: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 20,
  },
  todayDayText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  disabledDayText: {
    color: '#d1d5db',
  },
})
