import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Modal, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface MenuItem {
  label: string
  onPress: () => void
  disabled?: boolean
  destructive?: boolean
}

export interface MenuProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Menu items */
  items: MenuItem[]
  /** Custom container style */
  style?: ViewStyle
}

export const Menu: React.FC<MenuProps> = ({ trigger, items, style }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleItemPress = (item: MenuItem) => {
    if (!item.disabled) {
      item.onPress()
      setIsOpen(false)
    }
  }

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        {trigger}
      </TouchableOpacity>

      <Modal visible={isOpen} transparent onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              position: 'absolute',
              top: 100,
              right: spacing[4],
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: spacing[2],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              minWidth: 200,
            }}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemPress(item)}
                disabled={item.disabled}
                style={{
                  paddingVertical: spacing[3],
                  paddingHorizontal: spacing[4],
                  opacity: item.disabled ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSize.base,
                    color: item.destructive ? '#ef4444' : '#1f2937',
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

Menu.displayName = 'Menu'
