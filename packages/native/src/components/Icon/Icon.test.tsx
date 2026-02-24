import React from 'react'
import { render } from '@testing-library/react-native'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Icon name="★" />)
    expect(getByText('★')).toBeTruthy()
  })

  it('applies size and color', () => {
    const { getByText } = render(<Icon name="★" size={32} color="#ff0000" />)
    const icon = getByText('★')
    expect(icon.props.style).toContainEqual({ fontSize: 32, color: '#ff0000' })
  })
})
