import React from 'react'
import { View, Text, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface Geofence {
  id: string
  name: string
  center: {
    latitude: number
    longitude: number
  }
  radius: number
  color?: string
}

export interface GeofenceDisplayProps {
  /** Geofences to display */
  geofences: Geofence[]
  /** Current user location */
  userLocation?: {
    latitude: number
    longitude: number
  }
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * GeofenceDisplay component - Geofence visualization on map
 * Note: This is a visual placeholder. For production, integrate with mapping library
 *
 * @example
 * ```tsx
 * <GeofenceDisplay
 *   geofences={[
 *     {
 *       id: '1',
 *       name: 'Home',
 *       center: { latitude: 37.7883, longitude: -122.4324 },
 *       radius: 100,
 *       color: '#3b82f6'
 *     }
 *   ]}
 *   userLocation={{ latitude: 37.7880, longitude: -122.4320 }}
 * />
 * ```
 */
export const GeofenceDisplay: React.FC<GeofenceDisplayProps> = ({
  geofences,
  userLocation,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  }

  const mapPlaceholderStyle: ViewStyle = {
    backgroundColor: '#e5e7eb',
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const mapIconStyle: TextStyle = {
    fontSize: fontSize['4xl'],
    marginBottom: spacing[2],
  }

  const mapTextStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const legendStyle: ViewStyle = {
    padding: spacing[4],
    backgroundColor: '#f9fafb',
  }

  const legendTitleStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: spacing[3],
  }

  const geofenceItemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
    padding: spacing[2],
    backgroundColor: '#ffffff',
    borderRadius: 8,
  }

  const colorIndicatorStyle = (color: string): ViewStyle => ({
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: color,
    marginRight: spacing[2],
  })

  const geofenceNameStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.medium) as TextStyle['fontWeight'],
    color: '#111827',
    flex: 1,
  }

  const geofenceDetailsStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const userLocationStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: '#e0e7ff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  }

  const userIconStyle: TextStyle = {
    fontSize: fontSize.lg,
    marginRight: spacing[2],
  }

  const userTextStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#1e40af',
    flex: 1,
  }

  return (
    <View style={[containerStyle, style]} testID={testID} accessible accessibilityRole="none">
      <View style={mapPlaceholderStyle}>
        <Text style={mapIconStyle} accessible={false}>
          🗺️
        </Text>
        <Text style={mapTextStyle}>Geofence Map View</Text>
        <Text style={[mapTextStyle, { fontSize: fontSize.xs, marginTop: spacing[1] }]}>
          (Placeholder - integrate mapping library for production)
        </Text>
      </View>

      <View style={legendStyle}>
        <Text style={legendTitleStyle}>Geofences ({geofences.length})</Text>

        {geofences.map((geofence) => (
          <View
            key={geofence.id}
            style={geofenceItemStyle}
            accessible
            accessibilityRole="summary"
            accessibilityLabel={`Geofence ${geofence.name}, radius ${geofence.radius} meters`}
          >
            <View style={colorIndicatorStyle(geofence.color ?? '#3b82f6')} accessible={false} />
            <Text style={geofenceNameStyle}>{geofence.name}</Text>
            <Text style={geofenceDetailsStyle}>{geofence.radius}m</Text>
          </View>
        ))}

        {geofences.length === 0 && (
          <Text style={[geofenceDetailsStyle, { textAlign: 'center', padding: spacing[4] }]}>
            No geofences defined
          </Text>
        )}
      </View>

      {userLocation && (
        <View
          style={userLocationStyle}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`Current location: ${userLocation.latitude}, ${userLocation.longitude}`}
        >
          <Text style={userIconStyle} accessible={false}>
            📍
          </Text>
          <Text style={userTextStyle}>
            Your Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </Text>
        </View>
      )}
    </View>
  )
}

GeofenceDisplay.displayName = 'GeofenceDisplay'
