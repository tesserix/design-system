import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Button testID="button">Click me</Button>)
    expect(getByTestId('button')).toBeTruthy()
  })

  it('renders text content', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeTruthy()
  })

  it('handles press events', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <Button testID="button" onPress={onPress}>
        Click me
      </Button>
    )
    fireEvent.press(getByTestId('button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders with different variants', () => {
    const variants: Array<'solid' | 'outline' | 'ghost'> = ['solid', 'outline', 'ghost']
    variants.forEach((variant) => {
      const { getByTestId } = render(
        <Button testID={`button-${variant}`} variant={variant}>
          Button
        </Button>
      )
      expect(getByTestId(`button-${variant}`)).toBeTruthy()
    })
  })

  it('renders with different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
    sizes.forEach((size) => {
      const { getByTestId } = render(
        <Button testID={`button-${size}`} size={size}>
          Button
        </Button>
      )
      expect(getByTestId(`button-${size}`)).toBeTruthy()
    })
  })

  it('renders with different color schemes', () => {
    const colorSchemes: Array<'primary' | 'secondary' | 'error' | 'danger' | 'success'> = [
      'primary',
      'secondary',
      'error',
      'danger',
      'success',
    ]
    colorSchemes.forEach((colorScheme) => {
      const { getByTestId } = render(
        <Button testID={`button-${colorScheme}`} colorScheme={colorScheme}>
          Button
        </Button>
      )
      expect(getByTestId(`button-${colorScheme}`)).toBeTruthy()
    })
  })

  it('exposes button accessibility role and state', () => {
    const { getByTestId } = render(<Button testID="button">Save</Button>)
    const button = getByTestId('button')
    expect(button.props.accessibilityRole).toBe('button')
    expect(button.props.accessibilityLabel).toBe('Save')
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: false, busy: false })
    )
  })

  it('renders in loading state', () => {
    const { getByTestId } = render(
      <Button testID="button" isLoading>
        Click me
      </Button>
    )
    const button = getByTestId('button')
    expect(button).toBeTruthy()
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, busy: true })
    )
  })

  it('does not call onPress when loading', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <Button testID="button" isLoading onPress={onPress}>
        Click me
      </Button>
    )
    fireEvent.press(getByTestId('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('renders in disabled state', () => {
    const { getByTestId } = render(
      <Button testID="button" disabled>
        Click me
      </Button>
    )
    expect(getByTestId('button')).toBeTruthy()
  })

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <Button testID="button" disabled onPress={onPress}>
        Click me
      </Button>
    )
    fireEvent.press(getByTestId('button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('renders full width', () => {
    const { getByTestId } = render(
      <Button testID="button" fullWidth>
        Click me
      </Button>
    )
    expect(getByTestId('button')).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Button ref={ref}>Click me</Button>)
    expect(ref.current).toBeTruthy()
  })
})
