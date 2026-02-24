import React from 'react'
import { RefreshControl, ScrollView, ScrollViewProps } from 'react-native'

export interface PullToRefreshProps extends ScrollViewProps {
  /** Whether currently refreshing */
  refreshing: boolean
  /** Callback when pull to refresh */
  onRefresh: () => void
  /** Refresh indicator color */
  tintColor?: string
  /** Children */
  children: React.ReactNode
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  refreshing,
  onRefresh,
  tintColor = '#3b82f6',
  children,
  ...scrollViewProps
}) => {
  return (
    <ScrollView
      {...scrollViewProps}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={tintColor}
          colors={[tintColor]}
        />
      }
    >
      {children}
    </ScrollView>
  )
}

PullToRefresh.displayName = 'PullToRefresh'
