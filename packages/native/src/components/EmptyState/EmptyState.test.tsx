import React from 'react'
import { render } from '@testing-library/react-native'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title', () => {
    const { getByText } = render(<EmptyState title="No items found" />)
    expect(getByText('No items found')).toBeTruthy()
  })

  it('renders description when provided', () => {
    const { getByText } = render(
      <EmptyState title="No items" description="Try adding some items" />
    )
    expect(getByText('Try adding some items')).toBeTruthy()
  })
})
