import React from 'react'
import { render } from '@testing-library/react-native'
import { Countdown } from './Countdown'

describe('Countdown', () => {
  it('renders countdown values', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24) // 1 day from now
    const { getByText } = render(<Countdown targetDate={futureDate} />)
    expect(getByText('Days')).toBeTruthy()
    expect(getByText('Hours')).toBeTruthy()
    expect(getByText('Minutes')).toBeTruthy()
    expect(getByText('Seconds')).toBeTruthy()
  })

  it('hides labels when showLabels is false', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24)
    const { queryByText } = render(
      <Countdown targetDate={futureDate} showLabels={false} />
    )
    expect(queryByText('Days')).toBeNull()
  })

  it('renders in different formats', () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60)
    const { getByText, queryByText } = render(
      <Countdown targetDate={futureDate} format="hms" />
    )
    expect(queryByText('Days')).toBeNull()
    expect(getByText('Hours')).toBeTruthy()
  })

  it('shows zero when target date has passed', () => {
    const pastDate = new Date(Date.now() - 1000)
    const { getAllByText } = render(<Countdown targetDate={pastDate} />)
    expect(getAllByText('00').length).toBeGreaterThan(0)
  })
})
