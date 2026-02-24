import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ColorPickerProps {
  /** Selected color */
  value?: string
  /** Callback when color changes */
  onChange?: (color: string) => void
  /** Label text */
  label?: string
  /** Predefined color palette */
  colors?: string[]
  /** Disabled state */
  disabled?: boolean
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#000000',
]

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#3b82f6',
  onChange,
  label,
  colors = DEFAULT_COLORS,
  disabled = false,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(value)

  const handleSelectColor = (color: string) => {
    setSelectedColor(color)
  }

  const handleDone = () => {
    onChange?.(selectedColor)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setSelectedColor(value)
    setIsOpen(false)
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label || 'Color picker'}
        accessibilityHint="Tap to select a color"
        accessibilityState={{ disabled }}
      >
        <View style={[styles.colorPreview, { backgroundColor: value }]} />
        <Text style={styles.colorText}>{value.toUpperCase()}</Text>
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
              <TouchableOpacity
                onPress={handleCancel}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {label || 'Pick a Color'}
              </Text>
              <TouchableOpacity
                onPress={handleDone}
                accessibilityRole="button"
                accessibilityLabel="Done"
              >
                <Text style={[styles.headerButton, styles.headerButtonPrimary]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.colorGrid}>
              {colors.map((color) => {
                const isSelected = selectedColor === color
                return (
                  <TouchableOpacity
                    key={color}
                    style={styles.colorOption}
                    onPress={() => handleSelectColor(color)}
                    accessibilityRole="radio"
                    accessibilityLabel={`Color ${color}`}
                    accessibilityState={{ checked: isSelected }}
                  >
                    <View
                      style={[
                        styles.colorSwatch,
                        { backgroundColor: color },
                        isSelected && styles.colorSwatchSelected,
                      ]}
                    >
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

            <View style={styles.preview}>
              <View style={[styles.previewSwatch, { backgroundColor: selectedColor }]} />
              <Text style={styles.previewText}>{selectedColor.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

ColorPicker.displayName = 'ColorPicker'

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
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: semanticSpacing.md,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  colorText: {
    fontSize: fontSize.base,
    color: '#111827',
    fontFamily: 'monospace',
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: semanticSpacing.md,
  },
  colorOption: {
    width: '20%',
    aspectRatio: 1,
    padding: semanticSpacing.xs,
  },
  colorSwatch: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderColor: '#111827',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: semanticSpacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  previewSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: semanticSpacing.md,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  previewText: {
    fontSize: fontSize.lg,
    color: '#111827',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
})
