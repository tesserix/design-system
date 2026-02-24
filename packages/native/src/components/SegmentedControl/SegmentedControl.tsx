import React, { useState } from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface Segment {
  label: string
  value: string
}

export interface SegmentedControlProps {
  /** Segments */
  segments: Segment[]
  /** Active value */
  value?: string
  /** Callback when segment changes */
  onChange?: (value: string) => void
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary'
  /** Custom container style */
  style?: ViewStyle
  /** Custom segment style */
  segmentStyle?: ViewStyle
  /** Custom active segment style */
  activeSegmentStyle?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  value,
  onChange,
  colorScheme = 'primary',
  style,
  segmentStyle,
  activeSegmentStyle,
  textStyle,
}) => {
  const [activeValue, setActiveValue] = useState(value || segments[0]?.value)
  const activeColor = colorScheme === 'primary' ? '#3b82f6' : '#6b7280'

  const handlePress = (segmentValue: string) => {
    setActiveValue(segmentValue)
    if (onChange) {
      onChange(segmentValue)
    }
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          padding: spacing[1],
        },
        style,
      ]}
    >
      {segments.map((segment) => {
        const isActive = activeValue === segment.value
        return (
          <TouchableOpacity
            key={segment.value}
            onPress={() => handlePress(segment.value)}
            style={[
              {
                flex: 1,
                paddingVertical: spacing[2],
                paddingHorizontal: spacing[3],
                borderRadius: 6,
                backgroundColor: isActive ? activeColor : 'transparent',
              },
              segmentStyle,
              isActive && activeSegmentStyle,
            ]}
          >
            <Text
              style={[
                {
                  fontSize: fontSize.sm,
                  color: isActive ? '#ffffff' : '#6b7280',
                  fontWeight: isActive ? '600' : '400',
                  textAlign: 'center',
                },
                textStyle,
              ]}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

SegmentedControl.displayName = 'SegmentedControl'
