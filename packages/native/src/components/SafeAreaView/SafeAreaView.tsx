import React from 'react'
import {
  SafeAreaView as RNSafeAreaView,
  ViewProps,
} from 'react-native'

export interface SafeAreaViewProps extends ViewProps {
  /** Children */
  children: React.ReactNode
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  ...props
}) => {
  return (
    <RNSafeAreaView {...props}>
      {children}
    </RNSafeAreaView>
  )
}

SafeAreaView.displayName = 'SafeAreaView'
