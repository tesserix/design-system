import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Breadcrumbs } from './Breadcrumbs'

const mockItems = [
  { label: 'Home', onPress: jest.fn() },
  { label: 'Products', onPress: jest.fn() },
  { label: 'Details' },
]

describe('Breadcrumbs', () => {
  it('renders all items', () => {
    const { getByText } = render(<Breadcrumbs items={mockItems} />)
    expect(getByText('Home')).toBeTruthy()
    expect(getByText('Products')).toBeTruthy()
    expect(getByText('Details')).toBeTruthy()
  })

  it('calls onPress when item is pressed', () => {
    const { getByText } = render(<Breadcrumbs items={mockItems} />)
    fireEvent.press(getByText('Home'))
    expect(mockItems[0].onPress).toHaveBeenCalled()
  })
})
