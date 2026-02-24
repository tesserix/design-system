import React from 'react'
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps as RNKeyboardAvoidingViewProps,
  Platform,
} from 'react-native'

export interface KeyboardAvoidingViewProps extends RNKeyboardAvoidingViewProps {
  /** Children */
  children: React.ReactNode
}

export const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  behavior,
  ...props
}) => {
  const defaultBehavior = Platform.OS === 'ios' ? 'padding' : undefined

  return (
    <RNKeyboardAvoidingView
      behavior={behavior || defaultBehavior}
      {...props}
    >
      {children}
    </RNKeyboardAvoidingView>
  )
}

KeyboardAvoidingView.displayName = 'KeyboardAvoidingView'
