import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { LocationPicker, Location } from './LocationPicker'

describe('LocationPicker', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<LocationPicker />)
    expect(getByPlaceholderText('Search for a location...')).toBeTruthy()
  })

  it('displays custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <LocationPicker placeholder="Enter your address" />
    )
    expect(getByPlaceholderText('Enter your address')).toBeTruthy()
  })

  it('displays map placeholder', () => {
    const { getByText } = render(<LocationPicker />)
    expect(getByText('Map Preview')).toBeTruthy()
    expect(getByText('📍')).toBeTruthy()
  })

  it('displays selected location info', () => {
    const value: Location = {
      latitude: 37.7883,
      longitude: -122.4324,
      address: 'San Francisco, CA',
    }
    const { getByText } = render(<LocationPicker value={value} />)

    expect(getByText('San Francisco, CA')).toBeTruthy()
    expect(getByText('37.788300')).toBeTruthy()
    expect(getByText('-122.432400')).toBeTruthy()
  })

  it('displays location without address', () => {
    const value: Location = {
      latitude: 40.7128,
      longitude: -74.006,
    }
    const { getByText, queryByText } = render(<LocationPicker value={value} />)

    expect(getByText('40.712800')).toBeTruthy()
    expect(getByText('-74.006000')).toBeTruthy()
    expect(queryByText('Address')).toBeNull()
  })

  it('allows text input in search field', () => {
    const { getByPlaceholderText } = render(<LocationPicker />)
    const input = getByPlaceholderText('Search for a location...')

    fireEvent.changeText(input, 'New York')
    expect(input.props.value).toBe('New York')
  })

  it('calls onLocationSelect when search button is pressed', () => {
    const onLocationSelect = jest.fn()
    const { getByPlaceholderText, getByText } = render(
      <LocationPicker onLocationSelect={onLocationSelect} />
    )

    const input = getByPlaceholderText('Search for a location...')
    fireEvent.changeText(input, 'San Francisco')

    const searchButton = getByText('Search')
    fireEvent.press(searchButton)

    expect(onLocationSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        address: 'San Francisco',
        latitude: expect.any(Number),
        longitude: expect.any(Number),
      })
    )
  })

  it('calls onLocationSelect when enter is pressed in input', () => {
    const onLocationSelect = jest.fn()
    const { getByPlaceholderText } = render(
      <LocationPicker onLocationSelect={onLocationSelect} />
    )

    const input = getByPlaceholderText('Search for a location...')
    fireEvent.changeText(input, 'Boston')
    fireEvent(input, 'submitEditing')

    expect(onLocationSelect).toHaveBeenCalled()
  })

  it('initializes search input with value address', () => {
    const value: Location = {
      latitude: 37.7883,
      longitude: -122.4324,
      address: 'San Francisco, CA',
    }
    const { getByDisplayValue } = render(<LocationPicker value={value} />)
    expect(getByDisplayValue('San Francisco, CA')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(<LocationPicker testID="location-picker" style={customStyle} />)
    const picker = getByTestId('location-picker')
    expect(picker.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
