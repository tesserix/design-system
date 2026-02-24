import React from 'react'
import { render } from '@testing-library/react-native'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Divider testID="divider" />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('renders with horizontal orientation by default', () => {
    const { getByTestId } = render(<Divider testID="divider" />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('renders with vertical orientation', () => {
    const { getByTestId } = render(<Divider testID="divider" orientation="vertical" />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('renders with custom thickness', () => {
    const { getByTestId } = render(<Divider testID="divider" thickness={2} />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('renders with custom color', () => {
    const { getByTestId } = render(<Divider testID="divider" color="#3b82f6" />)
    const divider = getByTestId('divider')
    expect(divider.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#3b82f6' })
    )
  })

  it('renders with margin', () => {
    const { getByTestId } = render(<Divider testID="divider" margin={4} />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('renders with marginX', () => {
    const { getByTestId } = render(<Divider testID="divider" marginX={4} />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('renders with marginY', () => {
    const { getByTestId } = render(<Divider testID="divider" orientation="vertical" marginY={4} />)
    expect(getByTestId('divider')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { opacity: 0.5 }
    const { getByTestId } = render(<Divider testID="divider" style={customStyle} />)
    const divider = getByTestId('divider')
    expect(divider.props.style).toContainEqual(customStyle)
  })

  it('forwards ref', () => {
    const ref = React.createRef<any>()
    render(<Divider ref={ref} />)
    expect(ref.current).toBeTruthy()
  })
})
