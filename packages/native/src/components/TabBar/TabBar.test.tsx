import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { TabBar } from './TabBar'

const mockItems = [
  { label: 'Home', value: 'home' },
  { label: 'Search', value: 'search' },
  { label: 'Profile', value: 'profile' },
]

describe('TabBar', () => {
  it('renders all items', () => {
    const { getByText } = render(<TabBar items={mockItems} />)
    expect(getByText('Home')).toBeTruthy()
    expect(getByText('Search')).toBeTruthy()
    expect(getByText('Profile')).toBeTruthy()
  })

  it('calls onChange when item is pressed', () => {
    const onChange = jest.fn()
    const { getByText } = render(<TabBar items={mockItems} onChange={onChange} />)
    fireEvent.press(getByText('Search'))
    expect(onChange).toHaveBeenCalledWith('search')
  })

  it('hides labels when showLabels is false', () => {
    const { queryByText } = render(<TabBar items={mockItems} showLabels={false} />)
    expect(queryByText('Home')).toBeNull()
  })
})
