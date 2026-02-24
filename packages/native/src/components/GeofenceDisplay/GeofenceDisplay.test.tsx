import React from 'react'
import { render } from '@testing-library/react-native'
import { GeofenceDisplay, Geofence } from './GeofenceDisplay'

describe('GeofenceDisplay', () => {
  const mockGeofences: Geofence[] = [
    {
      id: '1',
      name: 'Home',
      center: { latitude: 37.7883, longitude: -122.4324 },
      radius: 100,
      color: '#3b82f6',
    },
    {
      id: '2',
      name: 'Work',
      center: { latitude: 37.7893, longitude: -122.4334 },
      radius: 200,
      color: '#10b981',
    },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<GeofenceDisplay geofences={mockGeofences} />)
    expect(getByText('Geofence Map View')).toBeTruthy()
  })

  it('displays geofence count', () => {
    const { getByText } = render(<GeofenceDisplay geofences={mockGeofences} />)
    expect(getByText('Geofences (2)')).toBeTruthy()
  })

  it('displays all geofences', () => {
    const { getByText } = render(<GeofenceDisplay geofences={mockGeofences} />)
    expect(getByText('Home')).toBeTruthy()
    expect(getByText('Work')).toBeTruthy()
  })

  it('displays geofence radius', () => {
    const { getByText } = render(<GeofenceDisplay geofences={mockGeofences} />)
    expect(getByText('100m')).toBeTruthy()
    expect(getByText('200m')).toBeTruthy()
  })

  it('displays empty state when no geofences', () => {
    const { getByText } = render(<GeofenceDisplay geofences={[]} />)
    expect(getByText('No geofences defined')).toBeTruthy()
    expect(getByText('Geofences (0)')).toBeTruthy()
  })

  it('displays user location when provided', () => {
    const { getByText } = render(
      <GeofenceDisplay
        geofences={mockGeofences}
        userLocation={{ latitude: 37.788, longitude: -122.432 }}
      />
    )
    expect(getByText(/Your Location: 37.7880, -122.4320/)).toBeTruthy()
    expect(getByText('📍')).toBeTruthy()
  })

  it('does not display user location when not provided', () => {
    const { queryByText } = render(<GeofenceDisplay geofences={mockGeofences} />)
    expect(queryByText(/Your Location:/)).toBeNull()
  })

  it('displays map placeholder', () => {
    const { getByText } = render(<GeofenceDisplay geofences={mockGeofences} />)
    expect(getByText('🗺️')).toBeTruthy()
    expect(getByText(/integrate mapping library/)).toBeTruthy()
  })

  it('applies default color when geofence color not specified', () => {
    const geofencesWithoutColor: Geofence[] = [
      {
        id: '1',
        name: 'Location',
        center: { latitude: 0, longitude: 0 },
        radius: 50,
      },
    ]
    const { getByText } = render(<GeofenceDisplay geofences={geofencesWithoutColor} />)
    expect(getByText('Location')).toBeTruthy()
  })

  it('renders with testID', () => {
    const { getByTestId } = render(
      <GeofenceDisplay geofences={mockGeofences} testID="geofence-display" />
    )
    expect(getByTestId('geofence-display')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <GeofenceDisplay geofences={mockGeofences} testID="geofence-display" style={customStyle} />
    )
    const display = getByTestId('geofence-display')
    expect(display.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
