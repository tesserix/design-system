import React from 'react'
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import { spacing } from '@tesserix/tokens/spacing'
import { fontSize, fontWeight } from '@tesserix/tokens/typography'

export interface MapMarkerProps {
  /** Marker title */
  title?: string
  /** Marker description */
  description?: string
  /** Marker icon */
  icon?: string
  /** Marker color */
  color?: string
  /** Whether marker is selected */
  selected?: boolean
  /** Callback when marker is pressed */
  onPress?: () => void
  /** Custom container style */
  style?: ViewStyle
  /** Test ID for testing */
  testID?: string
}

/**
 * MapMarker component - Custom map marker component
 * Note: This is a visual representation. For production use with react-native-maps
 *
 * @example
 * ```tsx
 * <MapMarker
 *   title="Coffee Shop"
 *   description="Open until 8 PM"
 *   icon="☕"
 *   color="#3b82f6"
 *   selected
 * />
 * ```
 */
export const MapMarker: React.FC<MapMarkerProps> = ({
  title,
  description,
  icon,
  color = '#ef4444',
  selected = false,
  onPress,
  style,
  testID,
}) => {
  const containerStyle: ViewStyle = {
    alignItems: 'center',
  }

  const markerPinStyle: ViewStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: selected ? 3 : 2,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    ...(selected && {
      transform: [{ scale: 1.2 }],
    }),
  }

  const iconStyle: TextStyle = {
    fontSize: fontSize.lg,
  }

  const markerTailStyle: ViewStyle = {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: color,
    marginTop: -2,
  }

  const calloutStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    padding: spacing[3],
    borderRadius: 8,
    marginTop: spacing[2],
    minWidth: 150,
    maxWidth: 200,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  }

  const calloutTitleStyle: TextStyle = {
    fontSize: fontSize.base,
    fontWeight: String(fontWeight.semibold) as TextStyle['fontWeight'],
    color: '#111827',
    marginBottom: description ? spacing[1] : 0,
  }

  const calloutDescriptionStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: '#6b7280',
  }

  const MarkerWrapper = onPress ? TouchableOpacity : View

  return (
    <MarkerWrapper
      style={[containerStyle, style]}
      onPress={onPress}
      disabled={!onPress}
      testID={testID}
      accessible
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={`Map marker${title ? `: ${title}` : ''}${description ? `, ${description}` : ''}`}
      accessibilityState={{ selected }}
    >
      <View style={markerPinStyle}>
        {icon ? (
          <Text style={iconStyle} accessible={false}>
            {icon}
          </Text>
        ) : (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#ffffff',
            }}
          />
        )}
      </View>
      <View style={markerTailStyle} />

      {selected && (title || description) && (
        <View style={calloutStyle}>
          {title && <Text style={calloutTitleStyle}>{title}</Text>}
          {description && <Text style={calloutDescriptionStyle}>{description}</Text>}
        </View>
      )}
    </MarkerWrapper>
  )
}

MapMarker.displayName = 'MapMarker'
