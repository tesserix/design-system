import React, { useRef } from 'react'
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native'

export interface SwipeableProps {
  /** Content to display */
  children: React.ReactNode
  /** Left action component */
  leftAction?: React.ReactNode
  /** Right action component */
  rightAction?: React.ReactNode
  /** Callback when swiped left */
  onSwipeLeft?: () => void
  /** Callback when swiped right */
  onSwipeRight?: () => void
  /** Swipe threshold (0-1) */
  threshold?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Swipeable: React.FC<SwipeableProps> = ({
  children,
  leftAction,
  rightAction,
  onSwipeLeft,
  onSwipeRight,
  threshold = 0.3,
  style,
}) => {
  const translateX = useRef(new Animated.Value(0)).current
  const lastOffset = useRef(0)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10
      },
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current)
        translateX.setValue(0)
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = gestureState.dx

        // Limit swipe range
        if (leftAction && newValue > 0) {
          translateX.setValue(Math.min(newValue, 100))
        } else if (rightAction && newValue < 0) {
          translateX.setValue(Math.max(newValue, -100))
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateX.flattenOffset()
        const shouldSwipeLeft = gestureState.dx < -100 * threshold
        const shouldSwipeRight = gestureState.dx > 100 * threshold

        if (shouldSwipeLeft && onSwipeLeft) {
          Animated.spring(translateX, {
            toValue: -100,
            useNativeDriver: true,
          }).start()
          lastOffset.current = -100
          onSwipeLeft()
        } else if (shouldSwipeRight && onSwipeRight) {
          Animated.spring(translateX, {
            toValue: 100,
            useNativeDriver: true,
          }).start()
          lastOffset.current = 100
          onSwipeRight()
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
          lastOffset.current = 0
        }
      },
    })
  ).current

  return (
    <View style={[styles.container, style]}>
      {leftAction && (
        <View style={[styles.actionContainer, styles.leftAction]}>
          {leftAction}
        </View>
      )}
      {rightAction && (
        <View style={[styles.actionContainer, styles.rightAction]}>
          {rightAction}
        </View>
      )}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  )
}

Swipeable.displayName = 'Swipeable'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAction: {
    left: 0,
  },
  rightAction: {
    right: 0,
  },
  content: {
    backgroundColor: '#ffffff',
  },
})
