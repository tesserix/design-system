import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface Step {
  label: string
  description?: string
}

export interface StepperProps {
  /** Steps */
  steps: Step[]
  /** Current active step index */
  activeStep?: number
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Custom container style */
  style?: ViewStyle
  /** Custom step style */
  stepStyle?: ViewStyle
  /** Custom label style */
  labelStyle?: TextStyle
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep = 0,
  orientation = 'horizontal',
  style,
  stepStyle,
  labelStyle,
}) => {
  return (
    <View
      style={[
        {
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
        },
        style,
      ]}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep
        const isCompleted = index < activeStep

        return (
          <React.Fragment key={index}>
            <View
              style={[
                {
                  alignItems: 'center',
                  flexDirection: orientation === 'horizontal' ? 'column' : 'row',
                },
                stepStyle,
              ]}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isCompleted || isActive ? '#3b82f6' : '#e5e7eb',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: orientation === 'horizontal' ? spacing[2] : 0,
                  marginRight: orientation === 'vertical' ? spacing[2] : 0,
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: fontSize.sm, fontWeight: '600' }}>
                  {index + 1}
                </Text>
              </View>
              <View>
                <Text
                  style={[
                    {
                      fontSize: fontSize.sm,
                      color: isActive ? '#1f2937' : '#6b7280',
                      fontWeight: isActive ? '600' : '400',
                      textAlign: orientation === 'horizontal' ? 'center' : 'left',
                    },
                    labelStyle,
                  ]}
                >
                  {step.label}
                </Text>
                {step.description && (
                  <Text
                    style={{
                      fontSize: fontSize.xs,
                      color: '#9ca3af',
                      marginTop: spacing[1],
                    }}
                  >
                    {step.description}
                  </Text>
                )}
              </View>
            </View>
            {index < steps.length - 1 && (
              <View
                style={{
                  width: orientation === 'horizontal' ? 40 : 2,
                  height: orientation === 'horizontal' ? 2 : 40,
                  backgroundColor: index < activeStep ? '#3b82f6' : '#e5e7eb',
                  marginHorizontal: orientation === 'horizontal' ? spacing[2] : 0,
                  marginVertical: orientation === 'vertical' ? spacing[2] : 0,
                  marginLeft: orientation === 'vertical' ? 15 : 0,
                }}
              />
            )}
          </React.Fragment>
        )
      })}
    </View>
  )
}

Stepper.displayName = 'Stepper'
