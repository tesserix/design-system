import React from 'react'
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  ModalProps as RNModalProps,
  ViewStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface ModalProps extends Omit<RNModalProps, 'children'> {
  /** Whether modal is visible */
  isOpen: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'full'
  /** Whether to show overlay */
  showOverlay?: boolean
  /** Whether clicking overlay closes modal */
  closeOnOverlayClick?: boolean
  /** Modal children */
  children: React.ReactNode
  /** Custom container style */
  style?: ViewStyle
  /** Accessibility label for modal content */
  accessibilityLabel?: string
}

const sizeMap: Record<NonNullable<ModalProps['size']>, ViewStyle['width']> = {
  sm: '60%',
  md: '80%',
  lg: '90%',
  full: '100%',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = 'md',
  showOverlay = true,
  closeOnOverlayClick = true,
  children,
  style,
  accessibilityLabel = 'Modal',
  animationType = 'fade',
  transparent = true,
  ...props
}) => {
  return (
    <RNModal
      visible={isOpen}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      {...props}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: showOverlay ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
        }}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={1}
          onPress={closeOnOverlayClick ? onClose : undefined}
        />
        <View
          style={[
            {
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: spacing[6],
              width: sizeMap[size],
              maxHeight: '80%',
            },
            style,
          ]}
          accessible
          accessibilityLabel={accessibilityLabel}
        >
          {children}
        </View>
      </View>
    </RNModal>
  )
}

Modal.displayName = 'Modal'
