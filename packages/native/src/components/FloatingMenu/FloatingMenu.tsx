import React, { useState, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface FloatingMenuItem {
  /** Item label */
  label: string
  /** Item icon */
  icon?: React.ReactNode
  /** Callback when item is pressed */
  onPress: () => void
}

export interface FloatingMenuProps {
  /** Menu items */
  items: FloatingMenuItem[]
  /** Main button icon */
  icon?: React.ReactNode
  /** Main button color */
  buttonColor?: string
  /** Position */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  items,
  icon,
  buttonColor = '#3b82f6',
  position = 'bottom-right',
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const animations = useRef(
    items.map(() => new Animated.Value(0))
  ).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1
    setIsOpen(!isOpen)

    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      ...animations.map((anim, index) =>
        Animated.spring(anim, {
          toValue,
          delay: index * 50,
          useNativeDriver: true,
        })
      ),
    ]).start()
  }

  const handleItemPress = (item: FloatingMenuItem) => {
    toggleMenu()
    item.onPress()
  }

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })

  const getPositionStyle = () => {
    const base = 20
    switch (position) {
      case 'top-left':
        return { top: base, left: base }
      case 'top-right':
        return { top: base, right: base }
      case 'bottom-left':
        return { bottom: base, left: base }
      case 'bottom-right':
      default:
        return { bottom: base, right: base }
    }
  }

  const isBottom = position.includes('bottom')

  return (
    <View
      style={[
        styles.container,
        getPositionStyle(),
        style,
      ]}
    >
      {isBottom && items.map((item, index) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 * (index + 1))],
        })

        return (
          <Animated.View
            key={index}
            style={[
              styles.menuItem,
              {
                opacity: animations[index],
                transform: [{ translateY }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              style={styles.menuButton}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              {item.icon}
            </TouchableOpacity>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </Animated.View>
        )
      })}

      <Animated.View style={{ transform: [{ rotate: rotation }] }}>
        <TouchableOpacity
          onPress={toggleMenu}
          style={[styles.mainButton, { backgroundColor: buttonColor }]}
          accessibilityRole="button"
          accessibilityLabel="Toggle menu"
          accessibilityState={{ expanded: isOpen }}
        >
          {icon || <Text style={styles.mainIcon}>+</Text>}
        </TouchableOpacity>
      </Animated.View>

      {!isBottom && items.map((item, index) => {
        const translateY = animations[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 60 * (index + 1)],
        })

        return (
          <Animated.View
            key={index}
            style={[
              styles.menuItem,
              {
                opacity: animations[index],
                transform: [{ translateY }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleItemPress(item)}
              style={styles.menuButton}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              {item.icon}
            </TouchableOpacity>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </Animated.View>
        )
      })}
    </View>
  )
}

FloatingMenu.displayName = 'FloatingMenu'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1000,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mainIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItem: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  labelContainer: {
    backgroundColor: '#111827',
    paddingHorizontal: semanticSpacing.sm,
    paddingVertical: semanticSpacing.xs,
    borderRadius: 4,
    marginRight: semanticSpacing.xs,
  },
  label: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
})
