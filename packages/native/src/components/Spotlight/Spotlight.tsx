import React from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Dimensions,
} from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

const { width, height } = Dimensions.get('window')

export interface SpotlightProps {
  /** Whether spotlight is visible */
  visible: boolean
  /** Target element position (x, y, width, height) */
  target: { x: number; y: number; width: number; height: number }
  /** Spotlight title */
  title?: string
  /** Spotlight description */
  description?: string
  /** Tooltip position */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  /** Callback when spotlight is dismissed */
  onDismiss: () => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Spotlight: React.FC<SpotlightProps> = ({
  visible,
  target,
  title,
  description,
  tooltipPosition = 'bottom',
  onDismiss,
  style,
}) => {
  if (!visible) return null

  const padding = 8
  const highlightArea = {
    x: target.x - padding,
    y: target.y - padding,
    width: target.width + padding * 2,
    height: target.height + padding * 2,
  }

  const getTooltipStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      maxWidth: width * 0.8,
    }

    switch (tooltipPosition) {
      case 'top':
        return {
          ...baseStyle,
          bottom: height - highlightArea.y + semanticSpacing.md,
          left: highlightArea.x,
        }
      case 'bottom':
        return {
          ...baseStyle,
          top: highlightArea.y + highlightArea.height + semanticSpacing.md,
          left: highlightArea.x,
        }
      case 'left':
        return {
          ...baseStyle,
          top: highlightArea.y,
          right: width - highlightArea.x + semanticSpacing.md,
        }
      case 'right':
        return {
          ...baseStyle,
          top: highlightArea.y,
          left: highlightArea.x + highlightArea.width + semanticSpacing.md,
        }
      default:
        return baseStyle
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      accessibilityViewIsModal={true}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDismiss}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Feature spotlight"
      >
        {/* Top section */}
        <View
          style={[
            styles.overlaySection,
            { height: highlightArea.y },
          ]}
        />

        {/* Middle section with spotlight */}
        <View style={{ flexDirection: 'row', height: highlightArea.height }}>
          <View
            style={[
              styles.overlaySection,
              { width: highlightArea.x },
            ]}
          />
          <View
            style={{
              width: highlightArea.width,
              height: highlightArea.height,
              borderWidth: 3,
              borderColor: '#3b82f6',
              borderRadius: 12,
              backgroundColor: 'transparent',
            }}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="Highlighted feature"
          />
          <View
            style={[
              styles.overlaySection,
              { flex: 1 },
            ]}
          />
        </View>

        {/* Bottom section */}
        <View style={[styles.overlaySection, { flex: 1 }]} />

        {/* Tooltip */}
        {(title || description) && (
          <View style={[styles.tooltip, getTooltipStyle(), style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Dismiss spotlight"
            >
              <Text style={styles.dismissButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Modal>
  )
}

Spotlight.displayName = 'Spotlight'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  overlaySection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: semanticSpacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#111827',
    marginBottom: semanticSpacing.sm,
  },
  description: {
    fontSize: fontSize.base,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: semanticSpacing.md,
  },
  dismissButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: semanticSpacing.sm,
    paddingHorizontal: semanticSpacing.lg,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dismissButtonText: {
    fontSize: fontSize.base,
    color: '#ffffff',
    fontWeight: '600',
  },
})
