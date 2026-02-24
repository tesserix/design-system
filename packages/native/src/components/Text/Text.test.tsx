import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from './Text'

describe('Text', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Text testID="text">Hello</Text>)
    expect(getByTestId('text')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<Text>Hello World</Text>)
    expect(getByText('Hello World')).toBeTruthy()
  })

  it('renders with different sizes', () => {
    const sizes: Array<'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'> = [
      'xs',
      'sm',
      'base',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
    ]
    sizes.forEach((size) => {
      const { getByTestId } = render(
        <Text testID={`text-${size}`} size={size}>
          Text
        </Text>
      )
      expect(getByTestId(`text-${size}`)).toBeTruthy()
    })
  })

  it('renders with bold text', () => {
    const { getByTestId } = render(
      <Text testID="text" bold>
        Bold Text
      </Text>
    )
    expect(getByTestId('text')).toBeTruthy()
  })

  it('renders with italic text', () => {
    const { getByTestId } = render(
      <Text testID="text" italic>
        Italic Text
      </Text>
    )
    expect(getByTestId('text')).toBeTruthy()
  })

  it('renders with underline', () => {
    const { getByTestId } = render(
      <Text testID="text" underline>
        Underlined Text
      </Text>
    )
    expect(getByTestId('text')).toBeTruthy()
  })

  it('renders with strikethrough', () => {
    const { getByTestId } = render(
      <Text testID="text" strikethrough>
        Strikethrough Text
      </Text>
    )
    expect(getByTestId('text')).toBeTruthy()
  })

  it('renders with custom color', () => {
    const { getByTestId } = render(
      <Text testID="text" color="#FF0000">
        Colored Text
      </Text>
    )
    expect(getByTestId('text')).toBeTruthy()
  })

  it('renders with text alignment', () => {
    const alignments: Array<'left' | 'center' | 'right' | 'justify'> = ['left', 'center', 'right', 'justify']
    alignments.forEach((align) => {
      const { getByTestId } = render(
        <Text testID={`text-${align}`} align={align}>
          Text
        </Text>
      )
      expect(getByTestId(`text-${align}`)).toBeTruthy()
    })
  })

  it('renders with line height', () => {
    const { getByTestId } = render(
      <Text testID="text" lineHeight={1.5}>
        Text with line height
      </Text>
    )
    expect(getByTestId('text')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Text ref={ref}>Text</Text>)
    expect(ref.current).toBeTruthy()
  })
})
