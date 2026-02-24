import React, { useState } from 'react'
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

  const isHorizontal = orientation === 'horizontal'

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (containerSize === 0) return

      const delta = isHorizontal ? gestureState.dx : gestureState.dy
      const newFirstSize = ratio * containerSize + delta

      let newRatio = newFirstSize / containerSize

      // Apply constraints
      if (newFirstSize < minSize) {
        newRatio = minSize / containerSize
      }
      if (maxSize && newFirstSize > maxSize) {
        newRatio = maxSize / containerSize
      }

      // Ensure ratio is between 0 and 1
      newRatio = Math.max(0, Math.min(1, newRatio))

      setRatio(newRatio)
      onRatioChange?.(newRatio)
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
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel="First pane"
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
      />

      <View
        style={[
          styles.pane,
          { flex: secondFlex },
        ]}
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel="Second pane"
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
