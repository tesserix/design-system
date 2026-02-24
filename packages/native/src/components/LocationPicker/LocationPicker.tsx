import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface Location {
  latitude: number
  longitude: number
  address?: string
}

export interface LocationPickerProps {
  /** Current selected location */
  value?: Location
  /** Callback when location is selected */
  onLocationSelect?: (location: Location) => void
  /** Placeholder text */
  placeholder?: string
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * LocationPicker component - Location selector with map and search
 * Note: This is a simplified placeholder. For production, integrate with mapping and geocoding APIs
 *
 * @example
 * ```tsx
 * <LocationPicker
 *   value={{ latitude: 37.7883, longitude: -122.4324, address: 'San Francisco, CA' }}
 *   onLocationSelect={(location) => console.log(location)}
 * />
 * ```
 */
export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onLocationSelect,
  placeholder = 'Search for a location...',
  style,
  testID,
}) => {
  const [searchQuery, setSearchQuery] = useState(value?.address ?? '')

  const handleSearch = () => {
    // Placeholder: In production, integrate with geocoding API
    const mockLocation: Location = {
      latitude: 37.7883,
      longitude: -122.4324,
      address: searchQuery,
    }
    onLocationSelect?.(mockLocation)
  }

  const containerStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  }

  const searchContainerStyle: ViewStyle = {
    flexDirection: 'row',
    padding: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  }

  const inputStyle: TextStyle = {
    flex: 1,
    fontSize: fontSize.base,
    color: '#111827',
    padding: spacing[2],
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginRight: spacing[2],
  }

  const searchButtonStyle: ViewStyle = {
    backgroundColor: '#3b82f6',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
    justifyContent: 'center',
  }

  const searchButtonTextStyle: TextStyle = {
    fontSize: fontSize.sm,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#ffffff',
  }

  const mapPlaceholderStyle: ViewStyle = {
    backgroundColor: '#e5e7eb',
    height: 200,
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

  const locationInfoStyle: ViewStyle = {
    padding: spacing[3],
    backgroundColor: '#f9fafb',
  }

  const infoLabelStyle: TextStyle = {
    fontSize: fontSize.xs,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: spacing[1],
  }

  const infoValueStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#111827',
    marginBottom: spacing[2],
  }

  return (
    <View style={[containerStyle, style]} testID={testID} accessible accessibilityRole="none">
      <View style={searchContainerStyle}>
        <TextInput
          style={inputStyle}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onSubmitEditing={handleSearch}
          accessible
          accessibilityRole="search"
          accessibilityLabel="Search for location"
        />
        <TouchableOpacity
          style={searchButtonStyle}
          onPress={handleSearch}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={searchButtonTextStyle}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={mapPlaceholderStyle}>
        <Text style={mapIconStyle} accessible={false}>
          📍
        </Text>
        <Text style={mapTextStyle}>Map Preview</Text>
        <Text style={[mapTextStyle, { fontSize: fontSize.xs, marginTop: spacing[1] }]}>
          (Placeholder - integrate mapping library)
        </Text>
      </View>

      {value && (
        <View style={locationInfoStyle}>
          {value.address && (
            <View>
              <Text style={infoLabelStyle}>Address</Text>
              <Text style={infoValueStyle}>{value.address}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: spacing[2] }}>
              <Text style={infoLabelStyle}>Latitude</Text>
              <Text style={infoValueStyle}>{value.latitude.toFixed(6)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={infoLabelStyle}>Longitude</Text>
              <Text style={infoValueStyle}>{value.longitude.toFixed(6)}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

LocationPicker.displayName = 'LocationPicker'
