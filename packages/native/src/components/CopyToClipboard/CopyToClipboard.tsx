import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface CopyToClipboardProps {
  /** Text to copy */
  text: string
  /** Button label */
  label?: string
  /** Copied label */
  copiedLabel?: string
  /** Display duration for copied state (ms) */
  copiedDuration?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
  /** Children to render */
  children?: React.ReactNode
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  copiedDuration = 2000,
  style,
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    // Note: In a real implementation, use @react-native-clipboard/clipboard
    // This is a placeholder showing the interface
    try {
      // await Clipboard.setString(text)
      if (!text) return
      setIsCopied(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setIsCopied(false), copiedDuration)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <TouchableOpacity
      onPress={handleCopy}
      style={[styles.container, isCopied && styles.copiedContainer, style]}
      accessibilityRole="button"
      accessibilityLabel={isCopied ? copiedLabel : label}
      accessibilityHint="Tap to copy to clipboard"
    >
      {children || (
        <Text style={[styles.label, isCopied && styles.copiedLabel]}>
          {isCopied ? copiedLabel : label}
        </Text>
      )}
    </TouchableOpacity>
  )
}

CopyToClipboard.displayName = 'CopyToClipboard'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: semanticSpacing.md,
    paddingVertical: semanticSpacing.sm,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  copiedContainer: {
    backgroundColor: '#dcfce7',
  },
  label: {
    fontSize: fontSize.sm,
    color: '#374151',
    fontWeight: '500',
  },
  copiedLabel: {
    color: '#15803d',
  },
})
