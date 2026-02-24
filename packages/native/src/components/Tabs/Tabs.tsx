import React, { useState } from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface Tab {
  label: string
  value: string
  disabled?: boolean
}

export interface TabsProps {
  /** Tab items */
  tabs: Tab[]
  /** Active tab value */
  value?: string
  /** Callback when tab changes */
  onChange?: (value: string) => void
  /** Color scheme */
  colorScheme?: 'primary' | 'secondary'
  /** Custom container style */
  style?: ViewStyle
  /** Custom tab style */
  tabStyle?: ViewStyle
  /** Custom active tab style */
  activeTabStyle?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  colorScheme = 'primary',
  style,
  tabStyle,
  activeTabStyle,
  textStyle,
}) => {
  const [activeTab, setActiveTab] = useState(value || tabs[0]?.value)
  const activeColor = colorScheme === 'primary' ? '#3b82f6' : '#6b7280'

  const handleTabPress = (tabValue: string) => {
    setActiveTab(tabValue)
    if (onChange) {
      onChange(tabValue)
    }
  }

  return (
    <View style={[{ flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#e5e7eb' }, style]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => !tab.disabled && handleTabPress(tab.value)}
            disabled={tab.disabled}
            style={[
              {
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[4],
                borderBottomWidth: 2,
                borderBottomColor: isActive ? activeColor : 'transparent',
                marginBottom: -2,
                opacity: tab.disabled ? 0.5 : 1,
              },
              tabStyle,
              isActive && activeTabStyle,
            ]}
          >
            <Text
              style={[
                {
                  fontSize: fontSize.base,
                  color: isActive ? activeColor : '#6b7280',
                  fontWeight: isActive ? '600' : '400',
                },
                textStyle,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

Tabs.displayName = 'Tabs'
