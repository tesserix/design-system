import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface HeaderProps {
  /** Header title */
  title: string
  /** Subtitle text */
  subtitle?: string
  /** Left element (icon/button) */
  leftElement?: React.ReactNode
  /** Right element (icon/button) */
  rightElement?: React.ReactNode
  /** Background color */
  backgroundColor?: string
  /** Title color */
  titleColor?: string
  /** Callback for left element press */
  onLeftPress?: () => void
  /** Callback for right element press */
  onRightPress?: () => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  backgroundColor = '#ffffff',
  titleColor = '#111827',
  onLeftPress,
  onRightPress,
  style,
}) => {
  return (
    <View
      style={[styles.container, { backgroundColor }, style]}
      accessibilityRole="header"
    >
      <View style={styles.leftSection}>
        {leftElement && (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Header left button"
          >
            {leftElement}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text
          style={[styles.title, { color: titleColor }]}
          numberOfLines={1}
          accessibilityRole="text"
          accessibilityLabel={`Header title: ${title}`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={styles.subtitle}
            numberOfLines={1}
            accessibilityRole="text"
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightElement && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Header right button"
          >
            {rightElement}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

Header.displayName = 'Header'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: semanticSpacing.md,
    paddingVertical: semanticSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: semanticSpacing.xs,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: '#6b7280',
    marginTop: 2,
  },
})
