import React, { useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  PanResponder,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native'

export interface SplitPaneProps {
  /** First pane content */
  first: React.ReactNode
  /** Second pane content */
  second: React.ReactNode
  /** Split orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Initial split ratio (0-1) */
  initialRatio?: number
  /** Minimum size for first pane */
  minSize?: number
  /** Maximum size for first pane */
  maxSize?: number
  /** Divider width/height */
  dividerSize?: number
  /** Custom style */
  style?: StyleProp<ViewStyle>
  /** Callback when ratio changes */
  onRatioChange?: (ratio: number) => void
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  first,
  second,
  orientation = 'horizontal',
  initialRatio = 0.5,
  minSize = 100,
  maxSize,
  dividerSize = 8,
  style,
  onRatioChange,
}) => {
  const [ratio, setRatio] = useState(initialRatio)
  const [containerSize, setContainerSize] = useState(0)
  const gestureStartRatioRef = useRef(initialRatio)

  const isHorizontal = orientation === 'horizontal'

  const clampRatio = (value: number) => {
    if (containerSize === 0) {
      return Math.max(0, Math.min(1, value))
    }

    const minRatio = minSize / containerSize
    const maxRatio = maxSize ? maxSize / containerSize : 1
    return Math.max(Math.max(0, minRatio), Math.min(Math.min(1, maxRatio), value))
  }

  const updateRatio = (nextRatio: number) => {
    const clamped = clampRatio(nextRatio)
    setRatio(clamped)
    onRatioChange?.(clamped)
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      gestureStartRatioRef.current = ratio
    },
    onPanResponderMove: (_, gestureState) => {
      if (containerSize === 0) return

      const delta = isHorizontal ? gestureState.dx : gestureState.dy
      const newFirstSize = gestureStartRatioRef.current * containerSize + delta

      const newRatio = newFirstSize / containerSize
      updateRatio(newRatio)
    },
  })

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setContainerSize(isHorizontal ? width : height)
  }

  const firstFlex = ratio
  const secondFlex = 1 - ratio

  return (
    <View
      style={[
        styles.container,
        isHorizontal ? styles.horizontal : styles.vertical,
        style,
      ]}
      onLayout={handleLayout}
      accessible={false}
    >
      <View
        style={[
          styles.pane,
          { flex: firstFlex },
        ]}
        accessible={false}
      >
        {first}
      </View>

      <View
        style={[
          styles.divider,
          isHorizontal
            ? { width: dividerSize, cursor: 'ew-resize' as any }
            : { height: dividerSize, cursor: 'ns-resize' as any },
        ]}
        {...panResponder.panHandlers}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel="Resize divider"
        accessibilityHint={`Drag to resize ${orientation} split panes`}
        accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}
        accessibilityActions={[
          { name: 'increment', label: 'Increase first pane size' },
          { name: 'decrement', label: 'Decrease first pane size' },
        ]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === 'increment') {
            updateRatio(ratio + 0.05)
          }
          if (nativeEvent.actionName === 'decrement') {
            updateRatio(ratio - 0.05)
          }
        }}
      />

      <View
        style={[
          styles.pane,
          { flex: secondFlex },
        ]}
        accessible={false}
      >
        {second}
      </View>
    </View>
  )
}

SplitPane.displayName = 'SplitPane'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  pane: {
    overflow: 'hidden',
  },
  divider: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
