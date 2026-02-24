import React from 'react'
import { render } from '@testing-library/react-native'
import { LoadingOverlay } from './LoadingOverlay'

describe('LoadingOverlay', () => {
  it('renders when visible', () => {
    const { getByTestId } = render(<LoadingOverlay visible testID="overlay" />)
    expect(getByTestId('overlay')).toBeTruthy()
  })

  it('does not render when not visible', () => {
    const { queryByTestId } = render(<LoadingOverlay visible={false} testID="overlay" />)
    expect(queryByTestId('overlay')).toBeNull()
  })

  it('shows message when provided', () => {
    const { getByText } = render(<LoadingOverlay visible message="Loading..." />)
    expect(getByText('Loading...')).toBeTruthy()
  })
})
