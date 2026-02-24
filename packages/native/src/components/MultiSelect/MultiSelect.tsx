import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface MultiSelectOption {
  /** Option label */
  label: string
  /** Option value */
  value: string
}

export interface MultiSelectProps {
  /** Options to display */
  options: MultiSelectOption[]
  /** Selected values */
  value?: string[]
  /** Callback when selection changes */
  onChange?: (values: string[]) => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  label,
  placeholder = 'Select items',
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>(value)

  const handleToggleOption = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue]
    setSelectedValues(newValues)
  }

  const handleDone = () => {
    onChange?.(selectedValues)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedValues(value)
    setIsOpen(false)
  }

  const selectedLabels = options
    .filter(option => value.includes(option.value))
    .map(option => option.label)
    .join(', ')

  const displayText = selectedLabels || placeholder

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label || 'Multi select'}
        accessibilityHint="Tap to select multiple options"
        accessibilityState={{ disabled }}
      >
        <Text
          style={[styles.triggerText, !selectedLabels && styles.placeholder]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {label || 'Select Items'}
              </Text>
              <TouchableOpacity onPress={handleDone}>
                <Text style={[styles.headerButton, styles.headerButtonPrimary]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = selectedValues.includes(item.value)
                return (
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleToggleOption(item.value)}
                    accessibilityRole="checkbox"
                    accessibilityLabel={item.label}
                    accessibilityState={{ checked: isSelected }}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

MultiSelect.displayName = 'MultiSelect'

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
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: semanticSpacing.md,
    backgroundColor: '#ffffff',
  },
  triggerDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  triggerText: {
    flex: 1,
    fontSize: fontSize.base,
    color: '#111827',
  },
  placeholder: {
    color: '#9ca3af',
  },
  arrow: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: semanticSpacing.sm,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: semanticSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#111827',
  },
  headerButton: {
    fontSize: fontSize.base,
    color: '#6b7280',
    padding: semanticSpacing.sm,
  },
  headerButtonPrimary: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: semanticSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: semanticSpacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: fontSize.base,
    color: '#111827',
    flex: 1,
  },
})
