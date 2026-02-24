import React from 'react'
import { TouchableOpacity, View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ListItemProps {
  /** Primary text */
  title: string
  /** Secondary text */
  subtitle?: string
  /** Left element */
  leftElement?: React.ReactNode
  /** Right element */
  rightElement?: React.ReactNode
  /** onPress handler */
  onPress?: () => void
  /** Disabled state */
  disabled?: boolean
  /** Accessibility label */
  accessibilityLabel?: string
  /** Custom container style */
  style?: ViewStyle
  /** Custom title style */
  titleStyle?: TextStyle
  /** Custom subtitle style */
  subtitleStyle?: TextStyle
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View

  return (
    <Wrapper
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessible
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          padding: spacing[4],
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {leftElement && (
        <View style={{ marginRight: spacing[3] }}>{leftElement}</View>
      )}
      <View style={{ flex: 1 }}>
        <Text
          style={[
            {
              fontSize: fontSize.base,
              color: '#1f2937',
              fontWeight: '500',
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[
              {
                fontSize: fontSize.sm,
                color: '#6b7280',
                marginTop: spacing[1],
              },
              subtitleStyle,
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && (
        <View style={{ marginLeft: spacing[3] }}>{rightElement}</View>
      )}
    </Wrapper>
  )
}

ListItem.displayName = 'ListItem'
