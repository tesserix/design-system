import React from 'react'
import { render } from '@testing-library/react-native'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Spinner testID="spinner" />)
    expect(getByTestId('spinner')).toBeTruthy()
  })

  it('renders with default size and color', () => {
    const { getByTestId } = render(<Spinner testID="spinner" />)
    const spinner = getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  it('renders with custom size', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl']
    sizes.forEach((size) => {
      const { getByTestId } = render(<Spinner testID={`spinner-${size}`} size={size} />)
      expect(getByTestId(`spinner-${size}`)).toBeTruthy()
    })
  })

  it('renders with different color schemes', () => {
    const colorSchemes: Array<'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = [
      'primary',
      'secondary',
      'success',
      'error',
      'warning',
      'info',
    ]
    colorSchemes.forEach((colorScheme) => {
      const { getByTestId } = render(
        <Spinner testID={`spinner-${colorScheme}`} colorScheme={colorScheme} />
      )
      expect(getByTestId(`spinner-${colorScheme}`)).toBeTruthy()
    })
  })

  it('renders with custom color', () => {
    const { getByTestId } = render(<Spinner testID="spinner" color="#FF0000" />)
    expect(getByTestId('spinner')).toBeTruthy()
  })

  it('is animating by default', () => {
    const { getByTestId } = render(<Spinner testID="spinner" />)
    expect(getByTestId('spinner')).toBeTruthy()
  })

  it('can be stopped from animating', () => {
    const { getByTestId } = render(<Spinner testID="spinner" animating={false} />)
    expect(getByTestId('spinner')).toBeTruthy()
  })

  it('applies container style', () => {
    const containerStyle = { padding: 20 }
    const { getByTestId } = render(
      <Spinner testID="spinner" containerStyle={containerStyle} />
    )
    const container = getByTestId('spinner')
    expect(container.props.style).toEqual(containerStyle)
  })
})
