import React from 'react'
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native'

export interface ScrollViewProps extends RNScrollViewProps {
  /** Children */
  children: React.ReactNode
}

export const ScrollView: React.FC<ScrollViewProps> = ({
  children,
  ...props
}) => {
  return (
    <RNScrollView {...props}>
      {children}
    </RNScrollView>
  )
}

ScrollView.displayName = 'ScrollView'
