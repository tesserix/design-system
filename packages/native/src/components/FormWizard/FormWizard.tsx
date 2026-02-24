import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface FormStep {
  id: string
  title: string
  component: React.ReactNode
}

export interface FormWizardProps {
  /** Form steps */
  steps: FormStep[]
  /** Callback when step changes */
  onStepChange?: (stepIndex: number) => void
  /** Callback when wizard is completed */
  onComplete?: () => void
  /** Initial step index */
  initialStep?: number
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * FormWizard component - Multi-step form with progress indicator
 *
 * @example
 * ```tsx
 * <FormWizard
 *   steps={[
 *     { id: '1', title: 'Personal Info', component: <PersonalInfoForm /> },
 *     { id: '2', title: 'Address', component: <AddressForm /> },
 *     { id: '3', title: 'Review', component: <ReviewForm /> }
 *   ]}
 *   onComplete={() => console.log('Form completed')}
 * />
 * ```
 */
export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onStepChange,
  onComplete,
  initialStep = 0,
  style,
  testID,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    } else {
      onComplete?.()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      onStepChange?.(newStep)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
      onStepChange?.(stepIndex)
    }
  }

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: '#ffffff',
  }

  const progressContainerStyle: ViewStyle = {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  }

  const stepsRowStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  }

  const stepItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  }

  const stepCircleStyle = (isActive: boolean, isCompleted: boolean): ViewStyle => ({
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  })

  const stepNumberStyle = (isActive: boolean, isCompleted: boolean): TextStyle => ({
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: isActive || isCompleted ? '#ffffff' : '#9ca3af',
  })

  const stepTitleStyle = (isActive: boolean): TextStyle => ({
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: isActive ? '#111827' : '#6b7280',
    flex: 1,
  })

  const stepLineStyle = (isCompleted: boolean): ViewStyle => ({
    flex: 1,
    height: 2,
    backgroundColor: isCompleted ? '#10b981' : '#e5e7eb',
    marginHorizontal: spacing[2],
  })

  const contentStyle: ViewStyle = {
    flex: 1,
    padding: spacing[4],
  }

  const buttonsContainerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  }

  const buttonStyle: ViewStyle = {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  }

  const primaryButtonStyle: ViewStyle = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
  }

  const secondaryButtonStyle: ViewStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  }

  const buttonTextStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#ffffff',
  }

  const secondaryButtonTextStyle: TextStyle = {
    ...buttonTextStyle,
    color: '#374151',
  }

  return (
    <View style={[containerStyle, style]} testID={testID} accessible accessibilityRole="none">
      {/* Progress Indicator */}
      <View style={progressContainerStyle}>
        <View style={stepsRowStyle}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <TouchableOpacity
                style={stepItemStyle}
                onPress={() => handleStepClick(index)}
                disabled={index > currentStep}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Step ${index + 1}: ${step.title}`}
                accessibilityState={{
                  selected: index === currentStep,
                  disabled: index > currentStep,
                }}
              >
                <View style={stepCircleStyle(index === currentStep, index < currentStep)}>
                  <Text style={stepNumberStyle(index === currentStep, index < currentStep)}>
                    {index < currentStep ? '✓' : index + 1}
                  </Text>
                </View>
                <Text
                  style={stepTitleStyle(index === currentStep)}
                  numberOfLines={1}
                  accessible={false}
                >
                  {step.title}
                </Text>
              </TouchableOpacity>
              {index < steps.length - 1 && <View style={stepLineStyle(index < currentStep)} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Current Step Content */}
      <View style={contentStyle}>{steps[currentStep].component}</View>

      {/* Navigation Buttons */}
      <View style={buttonsContainerStyle}>
        <TouchableOpacity
          style={secondaryButtonStyle}
          onPress={handlePrevious}
          disabled={currentStep === 0}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Previous step"
          accessibilityState={{ disabled: currentStep === 0 }}
        >
          <Text style={[secondaryButtonTextStyle, currentStep === 0 && { opacity: 0.5 }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={primaryButtonStyle}
          onPress={handleNext}
          accessible
          accessibilityRole="button"
          accessibilityLabel={currentStep === steps.length - 1 ? 'Complete' : 'Next step'}
        >
          <Text style={buttonTextStyle}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

FormWizard.displayName = 'FormWizard'
