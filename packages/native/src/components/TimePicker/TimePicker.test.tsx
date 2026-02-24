import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { TimePicker } from './TimePicker'

describe('TimePicker', () => {
  it('renders with placeholder', () => {
    const { getByText } = render(
      <TimePicker placeholder="Select time" />
    )
    expect(getByText('Select time')).toBeTruthy()
  })

  it('renders with label', () => {
    const { getByText } = render(
      <TimePicker label="Pick a time" />
    )
    expect(getByText('Pick a time')).toBeTruthy()
  })

  it('displays formatted time when value is provided', () => {
    const time = new Date(2024, 0, 1, 14, 30)
    const { getByText } = render(
      <TimePicker value={time} />
    )
    expect(getByText('02:30 PM')).toBeTruthy()
  })

  it('respects disabled state', () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <TimePicker disabled onChange={onPress} />
    )
    const button = getByRole('button')
    fireEvent.press(button)
    expect(onPress).not.toHaveBeenCalled()
  })
})
