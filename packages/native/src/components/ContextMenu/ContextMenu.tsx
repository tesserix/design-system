import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ContextMenuItem {
  /** Menu item label */
  label: string
  /** Menu item icon */
  icon?: React.ReactNode
  /** Handler for menu item press */
  onPress: () => void
  /** Whether the item is disabled */
  disabled?: boolean
  /** Whether the item is destructive */
  destructive?: boolean
}

export interface ContextMenuProps {
  /** Menu items */
  items: ContextMenuItem[]
  /** Content to wrap with long-press */
  children: React.ReactNode
  /** Custom style */
  style?: StyleProp<ViewStyle>
  /** Callback when menu opens */
  onOpen?: () => void
  /** Callback when menu closes */
  onClose?: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  children,
  style,
  onOpen,
  onClose,
}) => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent
    setPosition({ x: pageX, y: pageY })
    setVisible(true)
    onOpen?.()
  }

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  const handleItemPress = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onPress()
      handleClose()
    }
  }

  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={1}
        style={style}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Long press to open context menu"
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        accessible={true}
        accessibilityRole="menu"
        accessibilityLabel="Context menu"
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
          accessible={false}
        >
          <View
            style={[
              styles.menu,
              {
                top: position.y,
                left: position.x,
              },
            ]}
            accessible={true}
            accessibilityRole="menu"
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  item.disabled && styles.menuItemDisabled,
                  index === items.length - 1 && styles.menuItemLast,
                ]}
                onPress={() => handleItemPress(item)}
                disabled={item.disabled}
                accessible={true}
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                accessibilityState={{ disabled: item.disabled }}
              >
                {item.icon && <View style={styles.icon}>{item.icon}</View>}
                <Text
                  style={[
                    styles.menuItemText,
                    item.disabled && styles.menuItemTextDisabled,
                    item.destructive && styles.menuItemTextDestructive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  )
}

ContextMenu.displayName = 'ContextMenu'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: semanticSpacing.md,
    paddingHorizontal: semanticSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemDisabled: {
    opacity: 0.4,
  },
  icon: {
    marginRight: semanticSpacing.sm,
  },
  menuItemText: {
    fontSize: fontSize.base,
    color: '#111827',
  },
  menuItemTextDisabled: {
    color: '#9ca3af',
  },
  menuItemTextDestructive: {
    color: '#ef4444',
  },
})
