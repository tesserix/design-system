import React from 'react'
import { render } from '@testing-library/react-native'
import { MapView } from './MapView'

describe('MapView', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MapView />)
    expect(getByText('Map View')).toBeTruthy()
  })

  it('displays center coordinates', () => {
    const { getByText } = render(
      <MapView center={{ latitude: 37.7883, longitude: -122.4324 }} />
    )
    expect(getByText(/37.7883/)).toBeTruthy()
    expect(getByText(/-122.4324/)).toBeTruthy()
  })

  it('displays default center when not provided', () => {
    const { getByText } = render(<MapView />)
    expect(getByText(/0.0000/)).toBeTruthy()
  })

  it('displays zoom level', () => {
    const { getByText } = render(<MapView zoom={15} />)
    expect(getByText('Zoom: 15')).toBeTruthy()
  })

  it('displays default zoom when not provided', () => {
    const { getByText } = render(<MapView />)
    expect(getByText('Zoom: 10')).toBeTruthy()
  })

  it('displays marker count', () => {
    const markers = [
      { id: '1', latitude: 37.78825, longitude: -122.4324, title: 'Marker 1' },
      { id: '2', latitude: 37.79825, longitude: -122.4424, title: 'Marker 2' },
    ]
    const { getByText } = render(<MapView markers={markers} />)
    expect(getByText('Markers: 2')).toBeTruthy()
  })

  it('displays zero markers when none provided', () => {
    const { getByText } = render(<MapView />)
    expect(getByText('Markers: 0')).toBeTruthy()
  })

  it('displays production note', () => {
    const { getByText } = render(<MapView />)
    expect(getByText(/react-native-maps/)).toBeTruthy()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(
      <MapView
        center={{ latitude: 37.7883, longitude: -122.4324 }}
        markers={[{ id: '1', latitude: 37.7883, longitude: -122.4324 }]}
        testID="map"
      />
    )
    const map = getByTestId('map')
    expect(map.props.accessibilityRole).toBe('image')
    expect(map.props.accessibilityLabel).toContain('37.7883')
    expect(map.props.accessibilityLabel).toContain('-122.4324')
    expect(map.props.accessibilityLabel).toContain('1 markers')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(<MapView testID="map" style={customStyle} />)
    const map = getByTestId('map')
    expect(map.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
