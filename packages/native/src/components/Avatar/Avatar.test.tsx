import React from 'react'
import { render } from '@testing-library/react-native'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Avatar testID="avatar" name="John Doe" />)
    expect(getByTestId('avatar')).toBeTruthy()
  })

  it('displays initials from name', () => {
    const { getByText } = render(<Avatar name="John Doe" />)
    expect(getByText('JD')).toBeTruthy()
  })

  it('displays initials for single name', () => {
    const { getByText } = render(<Avatar name="John" />)
    expect(getByText('JO')).toBeTruthy()
  })

  it('displays initials for multiple names', () => {
    const { getByText } = render(<Avatar name="John Michael Doe" />)
    expect(getByText('JD')).toBeTruthy()
  })

  it('renders image when source is provided', () => {
    const source = { uri: 'https://example.com/avatar.jpg' }
    const { getByTestId } = render(
      <Avatar testID="avatar" source={source} imageProps={{ testID: 'avatar-image' }} />
    )
    const image = getByTestId('avatar-image')
    expect(image).toBeTruthy()
  })

  it('renders with different sizes', () => {
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
    sizes.forEach((size) => {
      const { getByTestId } = render(
        <Avatar testID={`avatar-${size}`} name="Test" size={size} />
      )
      expect(getByTestId(`avatar-${size}`)).toBeTruthy()
    })
  })

  it('renders with different shapes', () => {
    const shapes: Array<'circle' | 'square' | 'rounded'> = ['circle', 'square', 'rounded']
    shapes.forEach((shape) => {
      const { getByTestId } = render(
        <Avatar testID={`avatar-${shape}`} name="Test" shape={shape} />
      )
      expect(getByTestId(`avatar-${shape}`)).toBeTruthy()
    })
  })

  it('renders with different color schemes', () => {
    const colorSchemes: Array<'gray' | 'red' | 'green' | 'blue' | 'purple' | 'pink' | 'cyan'> = [
      'gray',
      'red',
      'green',
      'blue',
      'purple',
      'pink',
      'cyan',
    ]
    colorSchemes.forEach((colorScheme) => {
      const { getByTestId } = render(
        <Avatar testID={`avatar-${colorScheme}`} name="Test" colorScheme={colorScheme} />
      )
      expect(getByTestId(`avatar-${colorScheme}`)).toBeTruthy()
    })
  })

  it('applies custom styles', () => {
    const customStyle = { marginRight: 10 }
    const { getByTestId } = render(
      <Avatar testID="avatar" name="Test" style={customStyle} />
    )
    const avatar = getByTestId('avatar')
    expect(avatar.props.style).toContainEqual(customStyle)
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Avatar ref={ref} name="Test" />)
    expect(ref.current).toBeTruthy()
  })
})
