import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Card } from './Card'

describe('Card', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Card testID="card">
        <Text>Card content</Text>
      </Card>
    )
    expect(getByTestId('card')).toBeTruthy()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Card>
        <Text>Test content</Text>
      </Card>
    )
    expect(getByText('Test content')).toBeTruthy()
  })

  it('renders with different variants', () => {
    const variants: Array<'elevated' | 'outlined' | 'filled' | 'unstyled'> = [
      'elevated',
      'outlined',
      'filled',
      'unstyled',
    ]
    variants.forEach((variant) => {
      const { getByTestId } = render(
        <Card testID={`card-${variant}`} variant={variant}>
          <Text>Content</Text>
        </Card>
      )
      expect(getByTestId(`card-${variant}`)).toBeTruthy()
    })
  })

  it('renders with different padding sizes', () => {
    const paddings: Array<'none' | 'sm' | 'md' | 'lg' | 'xl'> = ['none', 'sm', 'md', 'lg', 'xl']
    paddings.forEach((padding) => {
      const { getByTestId } = render(
        <Card testID={`card-padding-${padding}`} padding={padding}>
          <Text>Content</Text>
        </Card>
      )
      expect(getByTestId(`card-padding-${padding}`)).toBeTruthy()
    })
  })

  it('renders with different rounded sizes', () => {
    const roundedSizes: Array<'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'> = [
      'none',
      'sm',
      'md',
      'lg',
      'xl',
      'full',
    ]
    roundedSizes.forEach((rounded) => {
      const { getByTestId } = render(
        <Card testID={`card-rounded-${rounded}`} rounded={rounded}>
          <Text>Content</Text>
        </Card>
      )
      expect(getByTestId(`card-rounded-${rounded}`)).toBeTruthy()
    })
  })

  it('renders with different elevation levels', () => {
    const elevations: Array<'none' | 'sm' | 'md' | 'lg' | 'xl'> = ['none', 'sm', 'md', 'lg', 'xl']
    elevations.forEach((elevation) => {
      const { getByTestId } = render(
        <Card testID={`card-elevation-${elevation}`} variant="elevated" elevation={elevation}>
          <Text>Content</Text>
        </Card>
      )
      expect(getByTestId(`card-elevation-${elevation}`)).toBeTruthy()
    })
  })

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 }
    const { getByTestId } = render(
      <Card testID="card" style={customStyle}>
        <Text>Content</Text>
      </Card>
    )
    const card = getByTestId('card')
    expect(card.props.style).toContainEqual(customStyle)
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(
      <Card ref={ref}>
        <Text>Content</Text>
      </Card>
    )
    expect(ref.current).toBeTruthy()
  })
})
