import React from 'react'
import { render } from '@testing-library/react-native'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Skeleton testID="skeleton" />)
    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('applies custom dimensions', () => {
    const { getByTestId } = render(
      <Skeleton width={200} height={40} testID="skeleton" />
    )
    expect(getByTestId('skeleton')).toBeTruthy()
  })
})
