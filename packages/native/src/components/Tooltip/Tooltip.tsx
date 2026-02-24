import React, { useState } from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TooltipProps {
  /** Tooltip label */
  label: string
  /** Children element */
  children: React.ReactNode
  /** Placement */
  placement?: 'top' | 'bottom'
  /** Custom container style */
  style?: ViewStyle
  /** Custom label style */
  labelStyle?: TextStyle
}

export const Tooltip: React.FC<TooltipProps> = ({
  label,
  children,
  placement = 'top',
  style,
  labelStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <View style={style}>
      <TouchableOpacity
        onPressIn={() => setIsVisible(true)}
        onPressOut={() => setIsVisible(false)}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>

      {isVisible && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#1f2937',
            borderRadius: 6,
            padding: spacing[2],
            ...(placement === 'top' && { bottom: '100%', marginBottom: spacing[2] }),
            ...(placement === 'bottom' && { top: '100%', marginTop: spacing[2] }),
          }}
        >
          <Text
            style={[
              {
                fontSize: fontSize.xs,
                color: '#ffffff',
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </View>
  )
}

Tooltip.displayName = 'Tooltip'
