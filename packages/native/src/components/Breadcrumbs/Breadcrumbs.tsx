import React from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface Breadcrumb {
  label: string
  onPress?: () => void
}

export interface BreadcrumbsProps {
  /** Breadcrumb items */
  items: Breadcrumb[]
  /** Separator */
  separator?: string
  /** Custom container style */
  style?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  style,
  textStyle,
}) => {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const Wrapper = item.onPress ? TouchableOpacity : View

        return (
          <React.Fragment key={index}>
            <Wrapper onPress={item.onPress}>
              <Text
                style={[
                  {
                    fontSize: fontSize.sm,
                    color: isLast ? '#1f2937' : '#3b82f6',
                    fontWeight: isLast ? '500' : '400',
                  },
                  textStyle,
                ]}
              >
                {item.label}
              </Text>
            </Wrapper>
            {!isLast && (
              <Text
                style={{
                  fontSize: fontSize.sm,
                  color: '#6b7280',
                  marginHorizontal: spacing[2],
                }}
              >
                {separator}
              </Text>
            )}
          </React.Fragment>
        )
      })}
    </View>
  )
}

Breadcrumbs.displayName = 'Breadcrumbs'
