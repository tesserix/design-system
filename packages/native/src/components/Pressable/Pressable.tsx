import React from 'react'
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native'

export interface PressableProps extends RNPressableProps {
  /** Children */
  children: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode)
}

export const Pressable: React.FC<PressableProps> = ({
  children,
  ...props
}) => {
  return (
    <RNPressable {...props}>
      {children}
    </RNPressable>
  )
}

Pressable.displayName = 'Pressable'
