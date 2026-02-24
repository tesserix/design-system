import React from 'react'
import { render } from '@testing-library/react-native'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Badge testID="badge">Label</Badge>)
    expect(getByTestId('badge')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<Badge>New</Badge>)
    expect(getByText('New')).toBeTruthy()
  })

  it('renders with different color schemes', () => {
    const colorSchemes: Array<'gray' | 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'pink' | 'cyan'> = [
      'gray',
      'red',
      'green',
      'blue',
      'yellow',
      'purple',
      'pink',
      'cyan',
    ]
    colorSchemes.forEach((colorScheme) => {
      const { getByTestId } = render(
        <Badge testID={`badge-${colorScheme}`} colorScheme={colorScheme}>
          Label
        </Badge>
      )
      expect(getByTestId(`badge-${colorScheme}`)).toBeTruthy()
    })
  })

  it('renders with different variants', () => {
    const variants: Array<'solid' | 'subtle' | 'outline'> = ['solid', 'subtle', 'outline']
    variants.forEach((variant) => {
      const { getByTestId } = render(
        <Badge testID={`badge-${variant}`} variant={variant}>
          Label
        </Badge>
      )
      expect(getByTestId(`badge-${variant}`)).toBeTruthy()
    })
  })

  it('renders with different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
    sizes.forEach((size) => {
      const { getByTestId } = render(
        <Badge testID={`badge-${size}`} size={size}>
          Label
        </Badge>
      )
      expect(getByTestId(`badge-${size}`)).toBeTruthy()
    })
  })

  it('renders with different rounded values', () => {
    const roundedValues: Array<'none' | 'sm' | 'md' | 'lg' | 'full'> = ['none', 'sm', 'md', 'lg', 'full']
    roundedValues.forEach((rounded) => {
      const { getByTestId } = render(
        <Badge testID={`badge-rounded-${rounded}`} rounded={rounded}>
          Label
        </Badge>
      )
      expect(getByTestId(`badge-rounded-${rounded}`)).toBeTruthy()
    })
  })

  it('renders numeric content', () => {
    const { getByText } = render(<Badge>99+</Badge>)
    expect(getByText('99+')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { marginLeft: 10 }
    const { getByTestId } = render(
      <Badge testID="badge" style={customStyle}>
        Label
      </Badge>
    )
    const badge = getByTestId('badge')
    expect(badge.props.style).toContainEqual(customStyle)
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Badge ref={ref}>Label</Badge>)
    expect(ref.current).toBeTruthy()
  })
})
