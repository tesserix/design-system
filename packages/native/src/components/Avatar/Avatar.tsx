import React from 'react'
import { View, Image, ImageProps, ViewProps, ViewStyle, TextStyle, ImageSourcePropType } from 'react-native'
import { Text } from '../Text'
import { spacing } from '@tesserix/tokens/spacing'
import { radius } from '@tesserix/tokens/radius'
import { fontSize } from '@tesserix/tokens/typography'

export interface AvatarProps extends Omit<ViewProps, 'children'> {
  /**
   * Image source for the avatar
   */
  source?: ImageSourcePropType
  /**
   * Name to display initials from (shown if no image)
   */
  name?: string
  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /**
   * Shape of the avatar
   * @default 'circle'
   */
  shape?: 'circle' | 'square' | 'rounded'
  /**
   * Color scheme for fallback
   * @default 'gray'
   */
  colorScheme?: 'gray' | 'red' | 'green' | 'blue' | 'purple' | 'pink' | 'cyan'
  /**
   * Image props to pass to the Image component
   */
  imageProps?: Partial<ImageProps>
}

const sizeMap = {
  xs: {
    size: spacing[6],
    fontSize: fontSize.xs,
  },
  sm: {
    size: spacing[8],
    fontSize: fontSize.sm,
  },
  md: {
    size: spacing[10],
    fontSize: fontSize.base,
  },
  lg: {
    size: spacing[12],
    fontSize: fontSize.lg,
  },
  xl: {
    size: spacing[16],
    fontSize: fontSize.xl,
  },
  '2xl': {
    size: spacing[20],
    fontSize: fontSize['2xl'],
  },
}

const shapeMap = {
  circle: radius.full,
  square: 0,
  rounded: radius.md,
}

const colorSchemes = {
  gray: { bg: '#e5e7eb', text: '#374151' },
  red: { bg: '#fee2e2', text: '#b91c1c' },
  green: { bg: '#d1fae5', text: '#047857' },
  blue: { bg: '#dbeafe', text: '#1e40af' },
  purple: { bg: '#f3e8ff', text: '#7e22ce' },
  pink: { bg: '#fce7f3', text: '#be185d' },
  cyan: { bg: '#cffafe', text: '#0e7490' },
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Avatar component for displaying user profile images or initials
 *
 * @example
 * ```tsx
 * <Avatar name="John Doe" />
 * <Avatar source={{ uri: 'https://example.com/avatar.jpg' }} />
 * <Avatar name="Jane Smith" size="lg" shape="rounded" colorScheme="blue" />
 * ```
 */
export const Avatar = React.forwardRef<View, AvatarProps>(
  (
    {
      source,
      name,
      size = 'md',
      shape = 'circle',
      colorScheme = 'gray',
      imageProps,
      style,
      ...props
    },
    ref
  ) => {
    const sizeConfig = sizeMap[size]
    const colorConfig = colorSchemes[colorScheme]
    const initials = name ? getInitials(name) : ''

    const containerStyle: ViewStyle = {
      width: sizeConfig.size,
      height: sizeConfig.size,
      borderRadius: shapeMap[shape],
      backgroundColor: colorConfig.bg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }

    const textStyle: TextStyle = {
      fontSize: sizeConfig.fontSize,
      color: colorConfig.text,
      fontWeight: '600',
    }

    const imageStyle = {
      width: sizeConfig.size,
      height: sizeConfig.size,
    }

    return (
      <View ref={ref} style={[containerStyle, style]} {...props}>
        {source ? (
          <Image
            source={source}
            style={imageStyle}
            {...imageProps}
          />
        ) : (
          <Text style={textStyle}>{initials}</Text>
        )}
      </View>
    )
  }
)

Avatar.displayName = 'Avatar'
