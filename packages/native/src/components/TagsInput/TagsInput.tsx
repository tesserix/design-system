import React, { useState } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TagsInputProps {
  /** Current tags */
  value?: string[]
  /** Callback when tags change */
  onChange?: (tags: string[]) => void
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Error message */
  error?: string
  /** Label text */
  label?: string
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add tag and press Enter...',
  disabled = false,
  error,
  label,
  style,
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange?.([...value, trimmed])
      setInputValue('')
    }
  }

  const handleRemoveTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index)
    onChange?.(newTags)
  }

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        <View style={styles.tags}>
          {value.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              {!disabled && (
                <TouchableOpacity
                  onPress={() => handleRemoveTag(index)}
                  style={styles.removeButton}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove tag ${tag}`}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddTag}
          onKeyPress={handleKeyPress}
          placeholder={value.length === 0 ? placeholder : ''}
          editable={!disabled}
          style={styles.input}
          accessibilityRole="none"
          accessibilityLabel={label || 'Tags input'}
          accessibilityState={{ disabled }}
        />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

TagsInput.displayName = 'TagsInput'

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
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: semanticSpacing.sm,
    backgroundColor: '#ffffff',
    minHeight: 44,
  },
  inputContainerError: {
    borderColor: '#ef4444',
  },
  inputContainerDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: semanticSpacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: semanticSpacing.xs,
    paddingLeft: semanticSpacing.sm,
    paddingRight: semanticSpacing.xs,
    marginRight: semanticSpacing.xs,
    marginBottom: semanticSpacing.xs,
  },
  tagText: {
    fontSize: fontSize.sm,
    color: '#ffffff',
    marginRight: semanticSpacing.xs,
  },
  removeButton: {
    padding: 2,
  },
  removeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: fontSize.base,
    color: '#111827',
    minWidth: 100,
    padding: semanticSpacing.xs,
  },
  error: {
    fontSize: fontSize.sm,
    color: '#ef4444',
    marginTop: semanticSpacing.xs,
  },
})
