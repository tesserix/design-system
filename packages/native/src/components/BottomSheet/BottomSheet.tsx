import React from 'react'
import {
  Modal,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface BottomSheetProps {
  /** Whether bottom sheet is visible */
  isOpen: boolean
  /** Callback when bottom sheet should close */
  onClose: () => void
  /** Bottom sheet height (percentage or fixed) */
  height?: ViewStyle['height']
  /** Whether clicking overlay closes sheet */
  closeOnOverlayClick?: boolean
  /** Bottom sheet children */
  children: React.ReactNode
  /** Custom container style */
  style?: ViewStyle
  /** Accessibility label for sheet content */
  accessibilityLabel?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  height = '50%',
  closeOnOverlayClick = true,
  children,
  style,
  accessibilityLabel = 'Bottom sheet',
}) => {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          activeOpacity={1}
          onPress={closeOnOverlayClick ? onClose : undefined}
        />
        <View
          style={[
            {
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: spacing[6],
              height,
            },
            style,
          ]}
          accessible
          accessibilityLabel={accessibilityLabel}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: '#d1d5db',
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: spacing[4],
            }}
          />
          {children}
        </View>
      </View>
    </Modal>
  )
}

BottomSheet.displayName = 'BottomSheet'
