import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Calendar } from './Calendar'

describe('Calendar', () => {
  it('renders current month and year', () => {
    const { getByText } = render(<Calendar />)
    const now = new Date()
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    expect(getByText(`${months[now.getMonth()]} ${now.getFullYear()}`)).toBeTruthy()
  })

  it('renders day names', () => {
    const { getByText } = render(<Calendar />)
    expect(getByText('Sun')).toBeTruthy()
    expect(getByText('Mon')).toBeTruthy()
    expect(getByText('Tue')).toBeTruthy()
  })

  it('calls onSelect when date is clicked', () => {
    const onSelect = jest.fn()
    const { getByText } = render(<Calendar onSelect={onSelect} />)
    const dayButton = getByText('15')
    fireEvent.press(dayButton)
    expect(onSelect).toHaveBeenCalled()
  })

  it('navigates to previous month', () => {
    const { getByLabelText, getByText } = render(<Calendar value={new Date(2024, 5, 15)} />)
    const prevButton = getByLabelText('Previous month')
    fireEvent.press(prevButton)
    expect(getByText('May 2024')).toBeTruthy()
  })

  it('navigates to next month', () => {
    const { getByLabelText, getByText } = render(<Calendar value={new Date(2024, 5, 15)} />)
    const nextButton = getByLabelText('Next month')
    fireEvent.press(nextButton)
    expect(getByText('July 2024')).toBeTruthy()
  })
})
