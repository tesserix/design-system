import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ActivityIndicator, Text } from 'react-native'
import { IconButton } from './IconButton'

const MockIcon = () => <Text>Icon</Text>

describe('IconButton', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <IconButton testID="icon-button" icon={<MockIcon />} aria-label="Test" />
    )
    expect(getByTestId('icon-button')).toBeTruthy()
  })

  it('renders icon', () => {
    const { getByText } = render(<IconButton icon={<MockIcon />} aria-label="Test" />)
    expect(getByText('Icon')).toBeTruthy()
  })

  it('handles press event', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <IconButton testID="icon-button" icon={<MockIcon />} aria-label="Test" onPress={onPress} />
    )
    fireEvent.press(getByTestId('icon-button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg' | 'xl'> = ['sm', 'md', 'lg', 'xl']
    sizes.forEach((size) => {
      const { getByTestId } = render(
        <IconButton testID={`icon-button-${size}`} icon={<MockIcon />} aria-label="Test" size={size} />
      )
      expect(getByTestId(`icon-button-${size}`)).toBeTruthy()
    })
  })

  it('renders different variants', () => {
    const variants: Array<'ghost' | 'outline' | 'solid'> = ['ghost', 'outline', 'solid']
    variants.forEach((variant) => {
      const { getByTestId } = render(
        <IconButton
          testID={`icon-button-${variant}`}
          icon={<MockIcon />}
          aria-label="Test"
          variant={variant}
        />
      )
      expect(getByTestId(`icon-button-${variant}`)).toBeTruthy()
    })
  })

  it('renders different color schemes', () => {
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
        <IconButton
          testID={`icon-button-${colorScheme}`}
          icon={<MockIcon />}
          aria-label="Test"
          colorScheme={colorScheme}
        />
      )
      expect(getByTestId(`icon-button-${colorScheme}`)).toBeTruthy()
    })
  })

  it('renders different rounded values', () => {
    const roundedValues: Array<'none' | 'sm' | 'md' | 'lg' | 'full'> = ['none', 'sm', 'md', 'lg', 'full']
    roundedValues.forEach((rounded) => {
      const { getByTestId } = render(
        <IconButton
          testID={`icon-button-rounded-${rounded}`}
          icon={<MockIcon />}
          aria-label="Test"
          rounded={rounded}
        />
      )
      expect(getByTestId(`icon-button-rounded-${rounded}`)).toBeTruthy()
    })
  })

  it('does not trigger onPress when disabled', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <IconButton
        testID="icon-button"
        icon={<MockIcon />}
        aria-label="Test"
        isDisabled
        onPress={onPress}
      />
    )
    fireEvent.press(getByTestId('icon-button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('does not trigger onPress when loading', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(
      <IconButton
        testID="icon-button"
        icon={<MockIcon />}
        aria-label="Test"
        isLoading
        onPress={onPress}
      />
    )
    fireEvent.press(getByTestId('icon-button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(
      <IconButton icon={<MockIcon />} aria-label="Close dialog" />
    )
    expect(getByLabelText('Close dialog')).toBeTruthy()
  })

  it('sets accessibility state when loading', () => {
    const { getByTestId, UNSAFE_getByType } = render(
      <IconButton testID="icon-button" icon={<MockIcon />} aria-label="Test" isLoading />
    )
    const button = getByTestId('icon-button')
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, busy: true })
    )
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<IconButton ref={ref} icon={<MockIcon />} aria-label="Test" />)
    expect(ref.current).toBeTruthy()
  })
})
