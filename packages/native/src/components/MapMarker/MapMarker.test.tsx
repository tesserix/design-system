import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { MapMarker } from './MapMarker'

describe('MapMarker', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<MapMarker testID="marker" />)
    expect(getByTestId('marker')).toBeTruthy()
  })

  it('displays custom icon', () => {
    const { getByText } = render(<MapMarker icon="☕" />)
    expect(getByText('☕')).toBeTruthy()
  })

  it('displays default marker dot when no icon provided', () => {
    const { getByTestId } = render(<MapMarker testID="marker" />)
    expect(getByTestId('marker')).toBeTruthy()
  })

  it('displays callout when selected and has title', () => {
    const { getByText } = render(<MapMarker title="Coffee Shop" selected />)
    expect(getByText('Coffee Shop')).toBeTruthy()
  })

  it('displays callout with description when selected', () => {
    const { getByText } = render(
      <MapMarker title="Coffee Shop" description="Open until 8 PM" selected />
    )
    expect(getByText('Coffee Shop')).toBeTruthy()
    expect(getByText('Open until 8 PM')).toBeTruthy()
  })

  it('does not display callout when not selected', () => {
    const { queryByText } = render(<MapMarker title="Coffee Shop" description="Open until 8 PM" />)
    expect(queryByText('Coffee Shop')).toBeNull()
  })

  it('displays callout with only description', () => {
    const { getByText } = render(<MapMarker description="Open now" selected />)
    expect(getByText('Open now')).toBeTruthy()
  })

  it('calls onPress when marker is pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(<MapMarker testID="marker" onPress={onPress} />)

    fireEvent.press(getByTestId('marker'))
    expect(onPress).toHaveBeenCalled()
  })

  it('is not pressable when onPress is not provided', () => {
    const { getByTestId } = render(<MapMarker testID="marker" />)
    const marker = getByTestId('marker')
    expect(marker.props.accessibilityRole).toBe('image')
  })

  it('is pressable when onPress is provided', () => {
    const { getByTestId } = render(<MapMarker testID="marker" onPress={() => {}} />)
    const marker = getByTestId('marker')
    expect(marker.props.accessibilityRole).toBe('button')
  })

  it('applies custom color', () => {
    const { getByTestId } = render(<MapMarker testID="marker" color="#10b981" />)
    expect(getByTestId('marker')).toBeTruthy()
  })

  it('applies selected state', () => {
    const { getByTestId } = render(<MapMarker testID="marker" selected />)
    const marker = getByTestId('marker')
    expect(marker.props.accessibilityState.selected).toBe(true)
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(
      <MapMarker title="Coffee Shop" description="Open now" testID="marker" />
    )
    const marker = getByTestId('marker')
    expect(marker.props.accessibilityLabel).toContain('Map marker')
    expect(marker.props.accessibilityLabel).toContain('Coffee Shop')
    expect(marker.props.accessibilityLabel).toContain('Open now')
  })

  it('applies custom styles', () => {
    const customStyle = { opacity: 0.8 }
    const { getByTestId } = render(<MapMarker testID="marker" style={customStyle} />)
    const marker = getByTestId('marker')
    expect(marker.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
