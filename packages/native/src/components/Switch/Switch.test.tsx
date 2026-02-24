import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Switch testID="switch" />)
    expect(getByTestId('switch')).toBeTruthy()
  })

  it('renders with label', () => {
    const { getByText } = render(<Switch label="Enable notifications" />)
    expect(getByText('Enable notifications')).toBeTruthy()
  })

  it('renders with helper text', () => {
    const { getByText } = render(<Switch helperText="This is a helper text" />)
    expect(getByText('This is a helper text')).toBeTruthy()
  })

  it('handles value change', () => {
    const onChange = jest.fn()
    const { UNSAFE_getByType } = render(<Switch onChange={onChange} />)
    const switchComponent = UNSAFE_getByType(require('react-native').Switch)
    fireEvent(switchComponent, 'valueChange', true)
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('renders in checked state', () => {
    const { UNSAFE_getByType } = render(<Switch isChecked={true} />)
    const switchComponent = UNSAFE_getByType(require('react-native').Switch)
    expect(switchComponent.props.value).toBe(true)
  })

  it('renders in unchecked state', () => {
    const { UNSAFE_getByType } = render(<Switch isChecked={false} />)
    const switchComponent = UNSAFE_getByType(require('react-native').Switch)
    expect(switchComponent.props.value).toBe(false)
  })

  it('renders different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
    sizes.forEach((size) => {
      const { getByTestId } = render(<Switch testID={`switch-${size}`} size={size} />)
      expect(getByTestId(`switch-${size}`)).toBeTruthy()
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
        <Switch testID={`switch-${colorScheme}`} colorScheme={colorScheme} />
      )
      expect(getByTestId(`switch-${colorScheme}`)).toBeTruthy()
    })
  })

  it('is disabled when isDisabled is true', () => {
    const { UNSAFE_getByType } = render(<Switch isDisabled />)
    const switchComponent = UNSAFE_getByType(require('react-native').Switch)
    expect(switchComponent.props.disabled).toBe(true)
  })

  it('does not trigger onChange when disabled', () => {
    const onChange = jest.fn()
    const { UNSAFE_getByType } = render(<Switch isDisabled onChange={onChange} />)
    const switchComponent = UNSAFE_getByType(require('react-native').Switch)
    fireEvent(switchComponent, 'valueChange', true)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Switch ref={ref} />)
    expect(ref.current).toBeTruthy()
  })

  it('applies accessibility label, hint, and state', () => {
    const { UNSAFE_getByType } = render(
      <Switch label="Enable notifications" helperText="Double tap to toggle" isChecked isDisabled />
    )
    const switchComponent = UNSAFE_getByType(require('react-native').Switch)
    expect(switchComponent.props.accessibilityRole).toBe('switch')
    expect(switchComponent.props.accessibilityLabel).toBe('Enable notifications')
    expect(switchComponent.props.accessibilityHint).toBe('Double tap to toggle')
    expect(switchComponent.props.accessibilityState).toEqual(
      expect.objectContaining({ checked: true, disabled: true })
    )
  })
})
