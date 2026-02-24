import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  TextInputProps,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface AutocompleteOption {
  /** Option label */
  label: string
  /** Option value */
  value: string
}

export interface AutocompleteProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style'> {
  /** Options to display */
  options: AutocompleteOption[]
  /** Input value */
  value?: string
  /** Callback when value changes */
  onChangeText?: (value: string) => void
  /** Callback when option is selected */
  onSelect?: (option: AutocompleteOption) => void
  /** Label text */
  label?: string
  /** Placeholder text */
  placeholder?: string
  /** Error message */
  error?: string
  /** Disabled state */
  disabled?: boolean
  /** Filter function */
  filterOptions?: (options: AutocompleteOption[], query: string) => AutocompleteOption[]
  /** Custom style for container */
  style?: StyleProp<ViewStyle>
  /** Custom style for input */
  inputStyle?: StyleProp<TextStyle>
}

const defaultFilter = (options: AutocompleteOption[], query: string) => {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return options.filter(option =>
    option.label.toLowerCase().includes(lowerQuery)
  )
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value = '',
  onChangeText,
  onSelect,
  label,
  placeholder = 'Type to search...',
  error,
  disabled = false,
  filterOptions = defaultFilter,
  style,
  inputStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredOptions = filterOptions(options, value)

  const handleChangeText = (text: string) => {
    onChangeText?.(text)
    setShowSuggestions(text.length > 0)
  }

  const handleSelectOption = (option: AutocompleteOption) => {
    onChangeText?.(option.label)
    onSelect?.(option)
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (value.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay hiding to allow option selection
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          editable={!disabled}
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            disabled && styles.inputDisabled,
            inputStyle,
          ]}
          accessibilityRole="search"
          accessibilityLabel={label || 'Autocomplete input'}
          accessibilityState={{ disabled }}
          {...textInputProps}
        />
        {showSuggestions && filteredOptions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelectOption(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

Autocomplete.displayName = 'Autocomplete'

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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: semanticSpacing.md,
    fontSize: fontSize.base,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  inputFocused: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    color: '#9ca3af',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    marginTop: semanticSpacing.xs,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  option: {
    padding: semanticSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionText: {
    fontSize: fontSize.base,
    color: '#111827',
  },
  error: {
    fontSize: fontSize.sm,
    color: '#ef4444',
    marginTop: semanticSpacing.xs,
  },
})
