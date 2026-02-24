import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TimePickerProps {
  /** Selected time */
  value?: Date
  /** Callback when time changes */
  onChange?: (time: Date) => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Format function */
  format?: (time: Date) => string
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

type DateTimePickerEvent = {
  type: 'set' | 'dismissed'
}

type NativeDateTimePickerProps = {
  value: Date
  mode: 'time'
  display: 'spinner' | 'default'
  onChange: (event: DateTimePickerEvent, selectedTime?: Date) => void
}

const NativeDateTimePicker: React.ComponentType<NativeDateTimePickerProps> | null = (() => {
  try {
    const module = require('@react-native-community/datetimepicker')
    return (module.default ?? module) as React.ComponentType<NativeDateTimePickerProps>
  } catch {
    return null
  }
})()

const defaultFormat = (time: Date) => {
  return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select time',
  disabled = false,
  format = defaultFormat,
  style,
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [internalValue, setInternalValue] = useState(value || new Date())

  const handleNativeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }

    if (event.type === 'set' && selectedTime) {
      setInternalValue(selectedTime)
      onChange?.(selectedTime)
    }
  }

  const handleConfirm = () => {
    setShowPicker(false)
    onChange?.(internalValue)
  }

  const handleCancel = () => {
    setShowPicker(false)
    setInternalValue(value || new Date())
  }

  const displayValue = value ? format(value) : placeholder

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, disabled && styles.inputDisabled]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label || 'Time picker'}
        accessibilityHint="Tap to select a time"
        accessibilityState={{ disabled }}
      >
        <Text style={[styles.text, !value && styles.placeholder]}>
          {displayValue}
        </Text>
      </TouchableOpacity>

      {NativeDateTimePicker && Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButton, styles.modalButtonPrimary]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <NativeDateTimePicker
                value={internalValue}
                mode="time"
                display="spinner"
                onChange={handleNativeChange}
              />
            </View>
          </View>
        </Modal>
      ) : NativeDateTimePicker ? (
        showPicker && (
          <NativeDateTimePicker
            value={internalValue}
            mode="time"
            display="default"
            onChange={handleNativeChange}
          />
        )
      ) : (
        <Modal
          visible={showPicker}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={[styles.modalButton, styles.modalButtonPrimary]}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.fallbackText}>{format(internalValue)}</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

TimePicker.displayName = 'TimePicker'

const styles = StyleSheet.create({
  container: {
    marginBottom: semanticSpacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: '#374151',
    marginBottom: semanticSpacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: semanticSpacing.md,
    backgroundColor: '#ffffff',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  text: {
    fontSize: fontSize.base,
    color: '#111827',
  },
  placeholder: {
    color: '#9ca3af',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: semanticSpacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: semanticSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalButton: {
    fontSize: fontSize.base,
    color: '#6b7280',
    padding: semanticSpacing.sm,
  },
  modalButtonPrimary: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  fallbackText: {
    fontSize: fontSize.lg,
    color: '#111827',
    textAlign: 'center',
    marginTop: semanticSpacing.md,
  },
})
