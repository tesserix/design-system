import React, { useRef } from 'react'
import {
  Animated,
  PanResponder,
  ViewStyle,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'

export interface DragAndDropProps {
  /** Content to be draggable */
  children: React.ReactNode
  /** Callback when drag starts */
  onDragStart?: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => void
  /** Callback when dragging */
  onDrag?: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => void
  /** Callback when drag ends */
  onDragEnd?: (event: GestureResponderEvent, gestureState: PanResponderGestureState) => void
  /** Whether drag is enabled */
  disabled?: boolean
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * DragAndDrop component - Draggable component with PanResponder
 *
 * @example
 * ```tsx
 * <DragAndDrop
 *   onDragStart={() => console.log('Drag started')}
 *   onDragEnd={() => console.log('Drag ended')}
 * >
 *   <View>
 *     <Text>Drag me!</Text>
 *   </View>
 * </DragAndDrop>
 * ```
 */
export const DragAndDrop: React.FC<DragAndDropProps> = ({
  children,
  onDragStart,
  onDrag,
  onDragEnd,
  disabled = false,
  style,
  testID,
}) => {
  const pan = useRef(new Animated.ValueXY()).current
  const isDragging = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (event, gestureState) => {
        isDragging.current = true
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        })
        pan.setValue({ x: 0, y: 0 })
        onDragStart?.(event, gestureState)
      },
      onPanResponderMove: (event, gestureState) => {
        onDrag?.(event, gestureState)
        return Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState)
      },
      onPanResponderRelease: (event, gestureState) => {
        isDragging.current = false
        pan.flattenOffset()
        onDragEnd?.(event, gestureState)
      },
    })
  ).current

  const containerStyle: ViewStyle = {
    padding: spacing[2],
  }

  return (
    <Animated.View
      style={[
        containerStyle,
        style,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
      testID={testID}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Draggable element"
      accessibilityHint="Drag to reposition"
      accessibilityState={{ disabled }}
    >
      {children}
    </Animated.View>
  )
}

DragAndDrop.displayName = 'DragAndDrop'
