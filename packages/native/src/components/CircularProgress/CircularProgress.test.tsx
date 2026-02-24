import React from 'react'
import { render } from '@testing-library/react-native'
import { CircularProgress } from './CircularProgress'

describe('CircularProgress', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<CircularProgress testID="progress" />)
    expect(getByTestId('progress')).toBeTruthy()
  })

  it('renders with value', () => {
    const { getByTestId } = render(<CircularProgress value={50} testID="progress" />)
    expect(getByTestId('progress')).toBeTruthy()
  })

  it('renders in indeterminate mode', () => {
    const { getByTestId } = render(<CircularProgress indeterminate testID="progress" />)
    expect(getByTestId('progress')).toBeTruthy()
  })
})
