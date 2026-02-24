import React, { useEffect, useRef, useState } from 'react'
import { View, TextInput, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize } from '@tesserix/tokens/typography'

export interface OTPInputProps {
  /** Number of OTP digits */
  length?: number
  /** OTP value */
  value?: string
  /** Callback when OTP changes */
  onChange?: (otp: string) => void
  /** Callback when OTP is complete */
  onComplete?: (otp: string) => void
  /** Whether to mask input */
  secure?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Error state */
  error?: boolean
  /** Custom container style */
  style?: ViewStyle
  /** Custom input style */
  inputStyle?: ViewStyle
  /** Custom text style */
  textStyle?: TextStyle
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  secure = false,
  disabled = false,
  error = false,
  style,
  inputStyle,
  textStyle,
}) => {
  const inputRefs = useRef<TextInput[]>([])
  const lastCompletedRef = useRef<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  useEffect(() => {
    const isComplete = value.length === length && /^\d+$/.test(value)

    if (isComplete && value !== lastCompletedRef.current) {
      lastCompletedRef.current = value
      onComplete?.(value)
      return
    }

    if (!isComplete) {
      lastCompletedRef.current = null
    }
  }, [length, onComplete, value])

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    const cleanText = text.replace(/[^0-9]/g, '')

    if (cleanText.length > 1) {
      // Handle paste
      const digits = cleanText.slice(0, length).split('')
      const newValue = value.split('')
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newValue[index + i] = digit
        }
      })
      const otp = newValue.join('').slice(0, length)
      onChange?.(otp)

      if (otp.length === length) {
        onComplete?.(otp)
        inputRefs.current[length - 1]?.blur()
      } else {
        const nextIndex = Math.min(index + digits.length, length - 1)
        inputRefs.current[nextIndex]?.focus()
      }
    } else if (cleanText.length === 1) {
      const newValue = value.split('')
      newValue[index] = cleanText
      const otp = newValue.join('').slice(0, length)
      onChange?.(otp)

      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      if (otp.length === length) {
        onComplete?.(otp)
      }
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (value[index]) {
        const newValue = value.split('')
        newValue[index] = ''
        onChange?.(newValue.join(''))
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const boxStyle: ViewStyle = {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: error ? '#ef4444' : '#d1d5db',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
    opacity: disabled ? 0.5 : 1,
  }

  const focusedBoxStyle: ViewStyle = {
    borderColor: error ? '#ef4444' : '#3b82f6',
  }

  const inputTextStyle: TextStyle = {
    fontSize: fontSize['2xl'],
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    width: '100%',
  }

  return (
    <View style={[{ flexDirection: 'row', gap: spacing[2] }, style]}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            boxStyle,
            focusedIndex === index && focusedBoxStyle,
            inputStyle,
          ]}
        >
          <TextInput
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref
            }}
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            maxLength={1}
            keyboardType="number-pad"
            secureTextEntry={secure}
            editable={!disabled}
            style={[inputTextStyle, textStyle]}
            selectTextOnFocus
          />
        </View>
      ))}
    </View>
  )
}

OTPInput.displayName = 'OTPInput'
