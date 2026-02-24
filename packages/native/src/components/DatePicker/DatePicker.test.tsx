import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renders placeholder when no value', () => {
    const { getByText } = render(<DatePicker />)
    expect(getByText('Select date')).toBeTruthy()
  })

  it('displays formatted date when value is provided', () => {
    const date = new Date('2024-01-15')
    const { getByText } = render(<DatePicker value={date} />)
    expect(getByText).toBeDefined()
  })

  it('opens modal when pressed', () => {
    const { getByText } = render(<DatePicker />)
    fireEvent.press(getByText('Select date'))
    expect(getByText('Confirm')).toBeTruthy()
  })

  it('calls onChange when date is confirmed', () => {
    const onChange = jest.fn()
    const { getByText } = render(<DatePicker onChange={onChange} />)
    fireEvent.press(getByText('Select date'))
    fireEvent.press(getByText('Confirm'))
    expect(onChange).toHaveBeenCalled()
  })
})
