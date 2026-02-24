import React, { useRef, useState } from 'react'
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
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
  /** Accessibility label for trigger */
  triggerLabel?: string
  /** Accessibility label for menu content */
  accessibilityLabel?: string
  /** Custom container style */
  style?: ViewStyle
}

type Rect = { x: number; y: number; width: number; height: number }

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const Menu: React.FC<MenuProps> = ({
  trigger,
  items,
  triggerLabel = 'Open menu',
  accessibilityLabel = 'Menu',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect | null>(null)
  const [menuRect, setMenuRect] = useState<Rect | null>(null)
  const triggerRef = useRef<View>(null)

  const handleItemPress = (item: MenuItem) => {
    if (!item.disabled) {
      item.onPress()
      setIsOpen(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)

    const triggerNode = triggerRef.current as View & {
      measureInWindow?: (callback: (x: number, y: number, width: number, height: number) => void) => void
    }

    if (!triggerNode?.measureInWindow) {
      setTriggerRect(null)
      return
    }

    triggerNode.measureInWindow((x, y, width, height) => {
      setTriggerRect({ x, y, width, height })
    })
  }

  const handleMenuLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setMenuRect((prev) => (prev?.width === width && prev?.height === height ? prev : { x: 0, y: 0, width, height }))
  }

  const screen = Dimensions.get('window')
  const menuWidth = menuRect?.width ?? 200
  const menuHeight = menuRect?.height ?? 0
  const margin = spacing[4]
  const topOffset = spacing[2]
  const defaultX = triggerRect?.x ?? margin
  const defaultY = triggerRect ? triggerRect.y + triggerRect.height + topOffset : 100
  const preferredLeft = triggerRect ? triggerRect.x + triggerRect.width - menuWidth : defaultX
  const left = clamp(preferredLeft, margin, screen.width - menuWidth - margin)
  const opensAbove = defaultY + menuHeight > screen.height - margin && Boolean(triggerRect)
  const top = opensAbove && triggerRect
    ? clamp(triggerRect.y - menuHeight - topOffset, margin, screen.height - menuHeight - margin)
    : clamp(defaultY, margin, screen.height - menuHeight - margin)

  return (
    <View style={style}>
      <View ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          onPress={handleOpen}
          accessibilityRole="button"
          accessibilityLabel={triggerLabel}
        >
          {trigger}
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            onLayout={handleMenuLayout}
            style={{
              position: 'absolute',
              top,
              left,
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
            accessible
            accessibilityLabel={accessibilityLabel}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemPress(item)}
                disabled={item.disabled}
                accessibilityRole="button"
                accessibilityState={{ disabled: item.disabled }}
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
