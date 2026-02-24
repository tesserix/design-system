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

export interface RichTextEditorProps {
  /** Editor content */
  value?: string
  /** Callback when content changes */
  onChange?: (text: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Disabled state */
  disabled?: boolean
  /** Minimum height */
  minHeight?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  disabled = false,
  minHeight = 150,
  style,
}) => {
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  // Note: In a real implementation, use a library like react-native-pell-rich-editor
  // This is a placeholder showing the interface

  const handleFormat = (format: 'bold' | 'italic' | 'underline') => {
    switch (format) {
      case 'bold':
        setIsBold(!isBold)
        break
      case 'italic':
        setIsItalic(!isItalic)
        break
      case 'underline':
        setIsUnderline(!isUnderline)
        break
    }
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => handleFormat('bold')}
          style={[styles.toolbarButton, isBold && styles.toolbarButtonActive]}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Bold"
          accessibilityState={{ selected: isBold, disabled }}
        >
          <Text style={[styles.toolbarText, { fontWeight: 'bold' }]}>B</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFormat('italic')}
          style={[styles.toolbarButton, isItalic && styles.toolbarButtonActive]}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Italic"
          accessibilityState={{ selected: isItalic, disabled }}
        >
          <Text style={[styles.toolbarText, { fontStyle: 'italic' }]}>I</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFormat('underline')}
          style={[styles.toolbarButton, isUnderline && styles.toolbarButtonActive]}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Underline"
          accessibilityState={{ selected: isUnderline, disabled }}
        >
          <Text style={[styles.toolbarText, { textDecorationLine: 'underline' }]}>
            U
          </Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.toolbarButton}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Bullet list"
          accessibilityState={{ disabled }}
        >
          <Text style={styles.toolbarText}>• List</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        multiline
        editable={!disabled}
        style={[
          styles.editor,
          { minHeight },
          isBold && { fontWeight: 'bold' },
          isItalic && { fontStyle: 'italic' },
          isUnderline && { textDecorationLine: 'underline' },
          disabled && styles.editorDisabled,
        ]}
        accessibilityLabel="Rich text editor"
        accessibilityState={{ disabled }}
      />
    </View>
  )
}

RichTextEditor.displayName = 'RichTextEditor'

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: semanticSpacing.xs,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  toolbarButton: {
    paddingHorizontal: semanticSpacing.sm,
    paddingVertical: semanticSpacing.xs,
    marginRight: semanticSpacing.xs,
    borderRadius: 4,
  },
  toolbarButtonActive: {
    backgroundColor: '#e5e7eb',
  },
  toolbarText: {
    fontSize: fontSize.sm,
    color: '#374151',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#d1d5db',
    marginHorizontal: semanticSpacing.xs,
  },
  editor: {
    padding: semanticSpacing.md,
    fontSize: fontSize.base,
    color: '#111827',
    textAlignVertical: 'top',
  },
  editorDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
  },
})
