import React from 'react'
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { semanticSpacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface ProgressStep {
  /** Step label */
  label: string
  /** Step description */
  description?: string
}

export interface ProgressStepsProps {
  /** Array of steps */
  steps: ProgressStep[]
  /** Current active step (0-indexed) */
  currentStep: number
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Custom style */
  style?: StyleProp<ViewStyle>
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  style,
}) => {
  const isVertical = orientation === 'vertical'

  return (
    <View
      style={[
        styles.container,
        isVertical ? styles.verticalContainer : styles.horizontalContainer,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${currentStep + 1} of ${steps.length}`}
      accessibilityValue={{
        min: 0,
        max: steps.length - 1,
        now: currentStep,
      }}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep
        const isLast = index === steps.length - 1

        return (
          <View
            key={index}
            style={[
              styles.stepContainer,
              isVertical ? styles.verticalStep : styles.horizontalStep,
            ]}
          >
            <View style={styles.stepIndicator}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && styles.stepCircleActive,
                  isCompleted && styles.stepCircleCompleted,
                ]}
              >
                {isCompleted ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      isActive && styles.stepNumberActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.stepLine,
                    isVertical ? styles.verticalLine : styles.horizontalLine,
                    isCompleted && styles.stepLineCompleted,
                  ]}
                />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  isCompleted && styles.stepLabelCompleted,
                ]}
              >
                {step.label}
              </Text>
              {step.description && (
                <Text style={styles.stepDescription}>{step.description}</Text>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

ProgressSteps.displayName = 'ProgressSteps'

const styles = StyleSheet.create({
  container: {
    padding: semanticSpacing.md,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verticalContainer: {
    flexDirection: 'column',
  },
  stepContainer: {
    position: 'relative',
  },
  horizontalStep: {
    flex: 1,
  },
  verticalStep: {
    marginBottom: semanticSpacing.lg,
  },
  stepIndicator: {
    position: 'relative',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepCircleActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  stepNumber: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: '#6b7280',
  },
  stepNumberActive: {
    color: '#ffffff',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepLine: {
    position: 'absolute',
    backgroundColor: '#e5e7eb',
  },
  horizontalLine: {
    height: 2,
    left: '50%',
    right: '-50%',
    top: 15,
  },
  verticalLine: {
    width: 2,
    top: 32,
    bottom: -24,
    left: 15,
  },
  stepLineCompleted: {
    backgroundColor: '#10b981',
  },
  stepContent: {
    marginTop: semanticSpacing.sm,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: '#10b981',
  },
  stepDescription: {
    fontSize: fontSize.xs,
    color: '#9ca3af',
    marginTop: 2,
    textAlign: 'center',
  },
})
