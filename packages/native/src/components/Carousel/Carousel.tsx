import React, { useState, useRef } from 'react'
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'

export interface CarouselProps {
  /** Items to render */
  children: React.ReactNode[]
  /** Show pagination dots */
  showPagination?: boolean
  /** Auto-play interval in ms */
  autoPlay?: boolean
  /** Auto-play interval duration */
  autoPlayInterval?: number
  /** Height of carousel */
  height?: number
  /** Dot color */
  dotColor?: string
  /** Active dot color */
  activeDotColor?: string
  /** On index change callback */
  onIndexChange?: (index: number) => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

const { width: screenWidth } = Dimensions.get('window')

export const Carousel: React.FC<CarouselProps> = ({
  children,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  height = 200,
  dotColor = '#d1d5db',
  activeDotColor = '#3b82f6',
  onIndexChange,
  style,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / screenWidth)

    if (index !== activeIndex) {
      setActiveIndex(index)
      onIndexChange?.(index)
    }
  }

  React.useEffect(() => {
    if (autoPlay && children.length > 1) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % children.length
          scrollViewRef.current?.scrollTo({
            x: nextIndex * screenWidth,
            animated: true,
          })
          return nextIndex
        })
      }, autoPlayInterval)

      return () => {
        if (autoPlayTimerRef.current) {
          clearInterval(autoPlayTimerRef.current)
        }
      }
    }
  }, [autoPlay, autoPlayInterval, children.length])

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={[styles.scrollView, { height }]}
        accessibilityRole="adjustable"
        accessibilityLabel={`Carousel, item ${activeIndex + 1} of ${children.length}`}
      >
        {children.map((child, index) => (
          <View key={index} style={[styles.slide, { width: screenWidth }]}>
            {child}
          </View>
        ))}
      </ScrollView>

      {showPagination && children.length > 1 && (
        <View style={styles.pagination} accessibilityRole="none">
          {children.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === activeIndex ? activeDotColor : dotColor,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  )
}

Carousel.displayName = 'Carousel'

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    width: '100%',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: semanticSpacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
})
