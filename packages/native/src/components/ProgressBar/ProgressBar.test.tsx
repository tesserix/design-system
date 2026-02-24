import React from 'react'
import { render } from '@testing-library/react-native'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<ProgressBar testID="progress" />)
    expect(getByTestId('progress')).toBeTruthy()
  })

  it('renders with value', () => {
    const { getByTestId } = render(<ProgressBar testID="progress" value={50} />)
    expect(getByTestId('progress')).toBeTruthy()
  })

  it('renders with value label', () => {
    const { getByText } = render(<ProgressBar value={75} showValue />)
    expect(getByText('75%')).toBeTruthy()
  })

  it('renders with custom value label', () => {
    const { getByText } = render(<ProgressBar value={50} showValue valueLabel="50 of 100" />)
    expect(getByText('50 of 100')).toBeTruthy()
  })

  it('renders different sizes', () => {
    const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']
    sizes.forEach((size) => {
      const { getByTestId } = render(<ProgressBar testID={`progress-${size}`} size={size} />)
      expect(getByTestId(`progress-${size}`)).toBeTruthy()
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
        <ProgressBar testID={`progress-${colorScheme}`} colorScheme={colorScheme} />
      )
      expect(getByTestId(`progress-${colorScheme}`)).toBeTruthy()
    })
  })

  it('renders in indeterminate state', () => {
    const { getByTestId } = render(<ProgressBar testID="progress" isIndeterminate />)
    expect(getByTestID('progress')).toBeTruthy()
  })

  it('clamps value to max', () => {
    const { getByText } = render(<ProgressBar value={150} max={100} showValue />)
    expect(getByText('100%')).toBeTruthy()
  })

  it('clamps value to min (0)', () => {
    const { getByText } = render(<ProgressBar value={-10} showValue />)
    expect(getByText('0%')).toBeTruthy()
  })

  it('handles custom max value', () => {
    const { getByText } = render(<ProgressBar value={25} max={50} showValue />)
    expect(getByText('50%')).toBeTruthy()
  })

  it('renders different rounded values', () => {
    const roundedValues: Array<'none' | 'sm' | 'md' | 'lg' | 'full'> = ['none', 'sm', 'md', 'lg', 'full']
    roundedValues.forEach((rounded) => {
      const { getByTestId } = render(
        <ProgressBar testID={`progress-rounded-${rounded}`} rounded={rounded} />
      )
      expect(getByTestId(`progress-rounded-${rounded}`)).toBeTruthy()
    })
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<ProgressBar ref={ref} />)
    expect(ref.current).toBeTruthy()
  })
})
