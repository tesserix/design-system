import React, { useState } from 'react'
import {
  Image as RNImage,
  ImageProps as RNImageProps,
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native'

export interface ImageProps extends RNImageProps {
  /** Fallback element when image fails to load */
  fallback?: React.ReactNode
  /** Show loading indicator */
  showLoading?: boolean
  /** Loading color */
  loadingColor?: string
  /** Container style */
  containerStyle?: ViewStyle
}

export const Image: React.FC<ImageProps> = ({
  fallback,
  showLoading = true,
  loadingColor = '#3b82f6',
  containerStyle,
  style,
  ...props
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  if (error && fallback) {
    return <View style={containerStyle}>{fallback}</View>
  }

  return (
    <View style={containerStyle}>
      {loading && showLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
          }}
        >
          <ActivityIndicator color={loadingColor} />
        </View>
      )}
      <RNImage
        {...props}
        style={style}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setError(true)
        }}
      />
    </View>
  )
}

Image.displayName = 'Image'
