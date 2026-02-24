import React, { useState } from 'react'
import { View, TouchableOpacity, Modal, ViewStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface PopoverProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Popover content */
  children: React.ReactNode
  /** Placement */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Custom container style */
  style?: ViewStyle
  /** Custom content style */
  contentStyle?: ViewStyle
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  style,
  contentStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false)

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
            style={[
              {
                position: 'absolute',
                backgroundColor: '#ffffff',
                borderRadius: 8,
                padding: spacing[4],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                ...(placement === 'bottom' && { top: 100, left: spacing[4] }),
                ...(placement === 'top' && { bottom: 100, left: spacing[4] }),
                ...(placement === 'left' && { right: 100, top: spacing[4] }),
                ...(placement === 'right' && { left: 100, top: spacing[4] }),
              },
              contentStyle,
            ]}
            onStartShouldSetResponder={() => true}
          >
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

Popover.displayName = 'Popover'
