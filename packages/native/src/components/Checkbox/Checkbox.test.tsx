import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Checkbox testID="checkbox" />)
    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('renders with label', () => {
    const { getByText } = render(<Checkbox label="Accept terms" />)
    expect(getByText('Accept terms')).toBeTruthy()
  })

  it('renders with helper text', () => {
    const { getByText } = render(<Checkbox helperText="This is required" />)
    expect(getByText('This is required')).toBeTruthy()
  })

  it('handles press event', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(<Checkbox testID="checkbox" onChange={onChange} />)
    fireEvent.press(getByTestId('checkbox'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('toggles from checked to unchecked', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(<Checkbox testID="checkbox" isChecked onChange={onChange} />)
    fireEvent.press(getByTestId('checkbox'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('renders in checked state', () => {
    const { getByTestId } = render(<Checkbox testID="checkbox" isChecked />)
    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('renders in unchecked state', () => {
    const { getByTestId } = render(<Checkbox testID="checkbox" isChecked={false} />)
    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('renders in indeterminate state', () => {
    const { getByTestId } = render(<Checkbox testID="checkbox" isIndeterminate />)
    expect(getByTestId('checkbox')).toBeTruthy()
  })

  it('renders different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
    sizes.forEach((size) => {
      const { getByTestId } = render(<Checkbox testID={`checkbox-${size}`} size={size} />)
      expect(getByTestId(`checkbox-${size}`)).toBeTruthy()
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
        <Checkbox testID={`checkbox-${colorScheme}`} colorScheme={colorScheme} />
      )
      expect(getByTestId(`checkbox-${colorScheme}`)).toBeTruthy()
    })
  })

  it('does not trigger onChange when disabled', () => {
    const onChange = jest.fn()
    const { getByTestId } = render(<Checkbox testID="checkbox" isDisabled onChange={onChange} />)
    fireEvent.press(getByTestId('checkbox'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Checkbox ref={ref} />)
    expect(ref.current).toBeTruthy()
  })
})
