import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface MapViewProps {
  /** Map center coordinates */
  center?: {
    latitude: number
    longitude: number
  }
  /** Zoom level */
  zoom?: number
  /** Map markers */
  markers?: Array<{
    id: string
    latitude: number
    longitude: number
    title?: string
  }>
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * MapView component - Map display placeholder
 * Note: This is a placeholder implementation. For production use, integrate react-native-maps
 *
 * @example
 * ```tsx
 * <MapView
 *   center={{ latitude: 37.78825, longitude: -122.4324 }}
 *   zoom={13}
 *   markers={[
 *     { id: '1', latitude: 37.78825, longitude: -122.4324, title: 'San Francisco' }
 *   ]}
 * />
 * ```
 */
export const MapView: React.FC<MapViewProps> = ({
  center = { latitude: 0, longitude: 0 },
  zoom = 10,
  markers = [],
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: spacing[4],
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const placeholderStyle: ViewStyle = {
    alignItems: 'center',
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize['4xl'],
    marginBottom: spacing[3],
  }

  const titleStyle: TextStyle = {
    fontSize: fontSize.lg,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#374151',
    marginBottom: spacing[2],
  }

  const infoStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: spacing[1],
  }

  const noteStyle: TextStyle = {
    fontSize: fontSize.xs,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: spacing[3],
    fontStyle: 'italic',
  }

  return (
    <View
      style={[containerStyle, style]}
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Map centered at latitude ${center.latitude}, longitude ${center.longitude}, with ${markers.length} markers`}
    >
      <View style={placeholderStyle}>
        <Text style={iconStyle} accessible={false}>
          🗺️
        </Text>
        <Text style={titleStyle}>Map View</Text>
        <Text style={infoStyle}>
          Center: {center.latitude.toFixed(4)}, {center.longitude.toFixed(4)}
        </Text>
        <Text style={infoStyle}>Zoom: {zoom}</Text>
        <Text style={infoStyle}>Markers: {markers.length}</Text>
        <Text style={noteStyle}>
          Note: For production use, integrate react-native-maps or similar mapping library
        </Text>
      </View>
    </View>
  )
}

MapView.displayName = 'MapView'
