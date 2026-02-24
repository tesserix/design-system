import React from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface TabBarItem {
  label: string
  value: string
  icon?: React.ReactNode
  badge?: number | string
}

export interface TabBarProps {
  /** Tab items */
  items: TabBarItem[]
  /** Active tab value */
  value?: string
  /** Callback when tab changes */
  onChange?: (value: string) => void
  /** Show labels */
  showLabels?: boolean
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary'
  /** Custom container style */
  style?: ViewStyle
  /** Custom item style */
  itemStyle?: ViewStyle
  /** Custom active item style */
  activeItemStyle?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

export const TabBar: React.FC<TabBarProps> = ({
  items,
  value,
  onChange,
  showLabels = true,
  colorScheme = 'primary',
  style,
  itemStyle,
  activeItemStyle,
  textStyle,
}) => {
  const activeColor = colorScheme === 'primary' ? '#3b82f6' : '#6b7280'

  const handlePress = (itemValue: string) => {
    if (onChange) {
      onChange(itemValue)
    }
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: spacing[2],
        },
        style,
      ]}
    >
      {items.map((item) => {
        const isActive = value === item.value

        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => handlePress(item.value)}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                paddingTop: spacing[3],
                paddingHorizontal: spacing[2],
              },
              itemStyle,
              isActive && activeItemStyle,
            ]}
          >
            {item.icon && (
              <View style={{ marginBottom: showLabels ? spacing[1] : 0, position: 'relative' }}>
                {item.icon}
                {item.badge !== undefined && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -8,
                      backgroundColor: '#ef4444',
                      borderRadius: 10,
                      minWidth: 18,
                      height: 18,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '600' }}>
                      {item.badge}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {showLabels && (
              <Text
                style={[
                  {
                    fontSize: fontSize.xs,
                    color: isActive ? activeColor : '#6b7280',
                    fontWeight: isActive ? '600' : '400',
                  },
                  textStyle,
                ]}
              >
                {item.label}
              </Text>
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

TabBar.displayName = 'TabBar'
