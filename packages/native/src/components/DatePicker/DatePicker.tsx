import React, { useMemo, useState } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface DatePickerProps {
  /** Selected date */
  value?: Date
  /** Callback when date changes */
  onChange?: (date: Date) => void
  /** Minimum date */
  minimumDate?: Date
  /** Maximum date */
  maximumDate?: Date
  /** Mode */
  mode?: 'date' | 'time' | 'datetime'
  /** Disabled state */
  disabled?: boolean
  /** Placeholder text */
  placeholder?: string
  /** Format function */
  format?: (date: Date) => string
  /** Custom container style */
  style?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

const defaultFormat = (date: Date, mode: 'date' | 'time' | 'datetime' = 'date') => {
  if (mode === 'time') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  if (mode === 'datetime') {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minimumDate,
  maximumDate,
  mode = 'date',
  disabled = false,
  placeholder = 'Select date',
  format,
  style,
  textStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const tempDate = useMemo(() => value || new Date(), [value])

  const displayValue = value ? (format ? format(value) : defaultFormat(value, mode)) : placeholder

  const handleConfirm = () => {
    const min = minimumDate?.getTime() ?? -Infinity
    const max = maximumDate?.getTime() ?? Infinity
    const clamped = Math.min(Math.max(tempDate.getTime(), min), max)
    onChange?.(new Date(clamped))
    setIsOpen(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[
          {
            paddingVertical: spacing[3],
            paddingHorizontal: spacing[4],
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
      >
        <Text
          style={[
            {
              fontSize: fontSize.base,
              color: value ? '#1f2937' : '#9ca3af',
            },
            textStyle,
          ]}
        >
          {displayValue}
        </Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: spacing[6],
              width: '90%',
              maxWidth: 400,
            }}
          >
            <Text style={{ fontSize: fontSize.lg, fontWeight: '600', marginBottom: spacing[4] }}>
              Select {mode}
            </Text>

            {/* Simple date selection UI */}
            <View style={{ marginBottom: spacing[4] }}>
              <Text style={{ fontSize: fontSize.base, color: '#6b7280', marginBottom: spacing[2] }}>
                {tempDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  ...(mode !== 'date' && { hour: '2-digit', minute: '2-digit' })
                })}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing[2] }}>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={{
                  flex: 1,
                  paddingVertical: spacing[3],
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: fontSize.base, color: '#6b7280' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  paddingVertical: spacing[3],
                  borderRadius: 8,
                  backgroundColor: '#3b82f6',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: fontSize.base, color: '#ffffff', fontWeight: '600' }}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

DatePicker.displayName = 'DatePicker'
