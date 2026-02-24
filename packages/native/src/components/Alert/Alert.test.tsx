import React from 'react'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Alert testID="alert" title="Alert" />)
    expect(getByTestId('alert')).toBeTruthy()
  })

  it('renders with title', () => {
    const { getByText } = render(<Alert title="Information" />)
    expect(getByText('Information')).toBeTruthy()
  })

  it('renders with description', () => {
    const { getByText } = render(<Alert description="This is a message" />)
    expect(getByText('This is a message')).toBeTruthy()
  })

  it('renders with both title and description', () => {
    const { getByText } = render(<Alert title="Success" description="Operation completed" />)
    expect(getByText('Success')).toBeTruthy()
    expect(getByText('Operation completed')).toBeTruthy()
  })

  it('renders children', () => {
    const { getByText } = render(
      <Alert>
        <Text>Custom content</Text>
      </Alert>
    )
    expect(getByText('Custom content')).toBeTruthy()
  })

  it('renders different status types', () => {
    const statuses: Array<'info' | 'success' | 'warning' | 'error'> = [
      'info',
      'success',
      'warning',
      'error',
    ]
    statuses.forEach((status) => {
      const { getByTestId } = render(<Alert testID={`alert-${status}`} status={status} title="Alert" />)
      expect(getByTestId(`alert-${status}`)).toBeTruthy()
    })
  })

  it('renders different variants', () => {
    const variants: Array<'subtle' | 'solid' | 'left-accent'> = ['subtle', 'solid', 'left-accent']
    variants.forEach((variant) => {
      const { getByTestId } = render(
        <Alert testID={`alert-${variant}`} variant={variant} title="Alert" />
      )
      expect(getByTestId(`alert-${variant}`)).toBeTruthy()
    })
  })

  it('renders different rounded values', () => {
    const roundedValues: Array<'none' | 'sm' | 'md' | 'lg'> = ['none', 'sm', 'md', 'lg']
    roundedValues.forEach((rounded) => {
      const { getByTestId } = render(
        <Alert testID={`alert-rounded-${rounded}`} rounded={rounded} title="Alert" />
      )
      expect(getByTestId(`alert-rounded-${rounded}`)).toBeTruthy()
    })
  })

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 }
    const { getByTestId } = render(<Alert testID="alert" title="Alert" style={customStyle} />)
    const alert = getByTestId('alert')
    expect(alert.props.style).toContainEqual(customStyle)
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Alert ref={ref} title="Alert" />)
    expect(ref.current).toBeTruthy()
  })
})
