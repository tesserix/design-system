import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ShareButtonProps {
  /** Content to share */
  content: {
    /** Title */
    title?: string
    /** Message */
    message?: string
    /** URL */
    url?: string
  }
  /** Button label */
  label?: string
  /** Icon component */
  icon?: React.ReactNode
  /** Callback on success */
  onShare?: () => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Button variant */
  variant?: 'default' | 'outline' | 'text'
  /** Custom style */
  style?: StyleProp<ViewStyle>
  /** Children to render */
  children?: React.ReactNode
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  content,
  label = 'Share',
  icon,
  onShare,
  onError,
  variant = 'default',
  style,
  children,
}) => {
  const handleShare = async () => {
    // Note: In a real implementation, use react-native Share API
    // This is a placeholder showing the interface
    try {
      const payload = content
      // await Share.share({
      //   title: payload.title,
      //   message: payload.message || payload.url || '',
      //   url: payload.url,
      // })
      void payload
      onShare?.()
    } catch (error) {
      onError?.(error as Error)
    }
  }

  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButton
      case 'text':
        return styles.textButton
      default:
        return styles.defaultButton
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText
      case 'text':
        return styles.textText
      default:
        return styles.defaultText
    }
  }

  return (
    <TouchableOpacity
      onPress={handleShare}
      style={[styles.container, getVariantStyle(), style]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Tap to share"
    >
      {children || (
        <>
          {icon}
          <Text style={[styles.label, getTextStyle()]}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

ShareButton.displayName = 'ShareButton'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: semanticSpacing.md,
    paddingVertical: semanticSpacing.sm,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  defaultButton: {
    backgroundColor: '#3b82f6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginLeft: semanticSpacing.xs,
  },
  defaultText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#3b82f6',
  },
  textText: {
    color: '#3b82f6',
  },
})
