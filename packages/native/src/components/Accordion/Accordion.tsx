import React, { useState } from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface AccordionProps {
  /** Accordion title */
  title: string
  /** Accordion children */
  children: React.ReactNode
  /** Initially expanded */
  defaultExpanded?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Custom container style */
  style?: ViewStyle
  /** Custom title style */
  titleStyle?: TextStyle
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultExpanded = false,
  disabled = false,
  style,
  titleStyle,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <View style={[{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 }, style]}>
      <TouchableOpacity
        onPress={() => !disabled && setExpanded(!expanded)}
        disabled={disabled}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: spacing[4],
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text
          style={[
            {
              fontSize: fontSize.base,
              fontWeight: '500',
              color: '#1f2937',
              flex: 1,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        <Text style={{ fontSize: fontSize.base, color: '#6b7280' }}>
          {expanded ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View
          style={{
            padding: spacing[4],
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
          }}
        >
          {children}
        </View>
      )}
    </View>
  )
}

Accordion.displayName = 'Accordion'
