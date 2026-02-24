import React, { useRef, useState } from 'react'
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface PopoverProps {
  /** Trigger element */
  trigger: React.ReactNode
  /** Popover content */
  children: React.ReactNode
  /** Placement */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Accessibility label for trigger */
  triggerLabel?: string
  /** Accessibility label for content */
  accessibilityLabel?: string
  /** Custom container style */
  style?: ViewStyle
  /** Custom content style */
  contentStyle?: ViewStyle
}

type Rect = { x: number; y: number; width: number; height: number }

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  triggerLabel = 'Open popover',
  accessibilityLabel = 'Popover',
  style,
  contentStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [triggerRect, setTriggerRect] = useState<Rect | null>(null)
  const [contentRect, setContentRect] = useState<Rect | null>(null)
  const triggerRef = useRef<View>(null)

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

  const handleContentLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setContentRect((prev) => (prev?.width === width && prev?.height === height ? prev : { x: 0, y: 0, width, height }))
  }

  const screen = Dimensions.get('window')
  const margin = spacing[4]
  const gap = spacing[2]
  const contentWidth = contentRect?.width ?? 220
  const contentHeight = contentRect?.height ?? 0
  const triggerX = triggerRect?.x ?? margin
  const triggerY = triggerRect?.y ?? margin
  const triggerW = triggerRect?.width ?? 0
  const triggerH = triggerRect?.height ?? 0

  let preferredLeft = triggerX
  let preferredTop = triggerY + triggerH + gap

  if (placement === 'top') {
    preferredTop = triggerY - contentHeight - gap
    preferredLeft = triggerX
  } else if (placement === 'left') {
    preferredTop = triggerY
    preferredLeft = triggerX - contentWidth - gap
  } else if (placement === 'right') {
    preferredTop = triggerY
    preferredLeft = triggerX + triggerW + gap
  }

  const left = clamp(preferredLeft, margin, screen.width - contentWidth - margin)
  const top = clamp(preferredTop, margin, screen.height - contentHeight - margin)

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
            onLayout={handleContentLayout}
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
                top,
                left,
              },
              contentStyle,
            ]}
            onStartShouldSetResponder={() => true}
            accessible
            accessibilityLabel={accessibilityLabel}
          >
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

Popover.displayName = 'Popover'
