import React from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface DrawerProps {
  /** Whether drawer is visible */
  isOpen: boolean
  /** Callback when drawer should close */
  onClose: () => void
  /** Drawer placement */
  placement?: 'left' | 'right'
  /** Drawer width */
  width?: ViewStyle['width']
  /** Whether clicking overlay closes drawer */
  closeOnOverlayClick?: boolean
  /** Drawer children */
  children: React.ReactNode
  /** Custom container style */
  style?: ViewStyle
  /** Accessibility label for drawer content */
  accessibilityLabel?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  placement = 'left',
  width = '80%',
  closeOnOverlayClick = true,
  children,
  style,
  accessibilityLabel = 'Drawer',
}) => {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {placement === 'left' && (
          <>
            <View
              style={[
                {
                  backgroundColor: '#ffffff',
                  width,
                  padding: spacing[6],
                },
                style,
              ]}
              accessible
              accessibilityLabel={accessibilityLabel}
            >
              {children}
            </View>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              activeOpacity={1}
              onPress={closeOnOverlayClick ? onClose : undefined}
            />
          </>
        )}
        {placement === 'right' && (
          <>
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              activeOpacity={1}
              onPress={closeOnOverlayClick ? onClose : undefined}
            />
            <View
              style={[
                {
                  backgroundColor: '#ffffff',
                  width,
                  padding: spacing[6],
                },
                style,
              ]}
              accessible
              accessibilityLabel={accessibilityLabel}
            >
              {children}
            </View>
          </>
        )}
      </View>
    </Modal>
  )
}

Drawer.displayName = 'Drawer'
