import React from 'react'
import { View, ViewProps, ViewStyle, TextStyle } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'

export interface AlertProps extends Omit<ViewProps, 'children'> {
  /**
   * Alert title
   */
  title?: string
  /**
   * Alert description
   */
  description?: string
  /**
   * Children to render inside alert
   */
  children?: React.ReactNode
  /**
   * Alert variant/status
   * @default 'info'
   */
  status?: 'info' | 'success' | 'warning' | 'error'
  /**
   * Visual variant
   * @default 'subtle'
   */
  variant?: 'subtle' | 'solid' | 'left-accent'
  /**
   * Border radius
   * @default 'md'
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg'
}

const statusConfig = {
  info: {
    bg: '#dbeafe',
    solidBg: '#3b82f6',
    border: '#93c5fd',
    text: '#1e40af',
  },
  success: {
    bg: '#d1fae5',
    solidBg: '#10b981',
    border: '#6ee7b7',
    text: '#047857',
  },
  warning: {
    bg: '#fef3c7',
    solidBg: '#f59e0b',
    border: '#fcd34d',
    text: '#b45309',
  },
  error: {
    bg: '#fee2e2',
    solidBg: '#ef4444',
    border: '#fca5a5',
    text: '#b91c1c',
  },
}

const roundedMap = {
  none: radius.none,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
}

/**
 * Alert component for displaying important messages
 *
 * @example
 * ```tsx
 * <Alert status="info" title="Information" description="This is an info message" />
 * <Alert status="success" variant="solid" title="Success" description="Operation completed" />
 * <Alert status="error" variant="left-accent" title="Error" description="Something went wrong" />
 * ```
 */
export const Alert = React.forwardRef<View, AlertProps>(
  (
    {
      title,
      description,
      children,
      status = 'info',
      variant = 'subtle',
      rounded = 'md',
      style,
      ...props
    },
    ref
  ) => {
    const config = statusConfig[status]
    const borderRadius = roundedMap[rounded]

    const containerStyles: ViewStyle = (() => {
      switch (variant) {
        case 'solid':
          return {
            backgroundColor: config.solidBg,
            padding: spacing[4],
            borderRadius,
          }
        case 'left-accent':
          return {
            backgroundColor: config.bg,
            padding: spacing[4],
            borderRadius,
            borderLeftWidth: 4,
            borderLeftColor: config.solidBg,
          }
        case 'subtle':
        default:
          return {
            backgroundColor: config.bg,
            padding: spacing[4],
            borderRadius,
            borderWidth: 1,
            borderColor: config.border,
          }
      }
    })()

    const titleStyles: TextStyle = {
      color: variant === 'solid' ? '#ffffff' : config.text,
      fontWeight: '600',
      marginBottom: description ? spacing[1] : 0,
    }

    const descriptionStyles: TextStyle = {
      color: variant === 'solid' ? '#ffffff' : config.text,
    }

    return (
      <View ref={ref} style={[containerStyles, style]} {...props}>
        {title && <Text style={titleStyles}>{title}</Text>}
        {description && <Text style={descriptionStyles}>{description}</Text>}
        {children}
      </View>
    )
  }
)

Alert.displayName = 'Alert'
