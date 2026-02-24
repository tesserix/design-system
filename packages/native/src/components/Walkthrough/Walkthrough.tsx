import React, { useState } from 'react'
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

const { height } = Dimensions.get('window')

export interface WalkthroughStep {
  /** Step title */
  title: string
  /** Step description */
  description: string
  /** Target element position (x, y, width, height) */
  target?: { x: number; y: number; width: number; height: number }
  /** Custom content */
  content?: React.ReactNode
}

export interface WalkthroughProps {
  /** Walkthrough steps */
  steps: WalkthroughStep[]
  /** Whether walkthrough is visible */
  visible: boolean
  /** Callback when walkthrough completes */
  onComplete: () => void
  /** Callback when walkthrough is skipped */
  onSkip?: () => void
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const Walkthrough: React.FC<WalkthroughProps> = ({
  steps,
  visible,
  onComplete,
  onSkip,
  style,
}) => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    setCurrentStep(0)
    onSkip?.()
  }

  const handleComplete = () => {
    setCurrentStep(0)
    onComplete()
  }

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  if (!visible || !step) return null

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleComplete}
      accessibilityViewIsModal={true}
    >
      <View style={styles.overlay}>
        {/* Highlight target area if provided */}
        {step.target && (
          <>
            {/* Top overlay */}
            <View
              style={[
                styles.overlaySection,
                { height: step.target.y },
              ]}
            />
            {/* Middle row */}
            <View style={{ flexDirection: 'row', height: step.target.height }}>
              <View style={[styles.overlaySection, { width: step.target.x }]} />
              <View
                style={{
                  width: step.target.width,
                  height: step.target.height,
                  borderWidth: 2,
                  borderColor: '#3b82f6',
                  borderRadius: 8,
                }}
              />
              <View
                style={[
                  styles.overlaySection,
                  { flex: 1 },
                ]}
              />
            </View>
            {/* Bottom overlay */}
            <View style={[styles.overlaySection, { flex: 1 }]} />
          </>
        )}

        {/* Tooltip */}
        <View style={[styles.tooltip, style]}>
          <View style={styles.header}>
            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {steps.length}
            </Text>
            <TouchableOpacity
              onPress={handleSkip}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Skip walkthrough"
            >
              <Text style={styles.skipButton}>Skip</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>

          {step.content && <View style={styles.content}>{step.content}</View>}

          <View style={styles.footer}>
            {!isFirst && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Previous step"
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <View style={styles.dots}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentStep && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={isLast ? 'Complete walkthrough' : 'Next step'}
            >
              <Text style={styles.nextButtonText}>
                {isLast ? 'Done' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

Walkthrough.displayName = 'Walkthrough'

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  overlaySection: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: semanticSpacing.lg,
    maxHeight: height * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: semanticSpacing.md,
  },
  stepCounter: {
    fontSize: fontSize.sm,
    color: '#6b7280',
  },
  skipButton: {
    fontSize: fontSize.sm,
    color: '#3b82f6',
    fontWeight: '600',
  },
  title: {
    fontSize: fontSize.xl,
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
  content: {
    marginBottom: semanticSpacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: semanticSpacing.md,
  },
  backButton: {
    paddingVertical: semanticSpacing.sm,
    paddingHorizontal: semanticSpacing.md,
  },
  backButtonText: {
    fontSize: fontSize.base,
    color: '#6b7280',
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    gap: semanticSpacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    backgroundColor: '#3b82f6',
    width: 24,
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: semanticSpacing.sm,
    paddingHorizontal: semanticSpacing.lg,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: fontSize.base,
    color: '#ffffff',
    fontWeight: '600',
  },
})
