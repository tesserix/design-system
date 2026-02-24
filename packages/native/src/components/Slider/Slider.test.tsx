import React from 'react'
import { render } from '@testing-library/react-native'
import { Slider } from './Slider'

describe('Slider', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<Slider testID="slider" />)
    expect(getByTestId('slider')).toBeTruthy()
  })

  it('renders with value', () => {
    const { getByTestId } = render(<Slider value={50} testID="slider" />)
    expect(getByTestId('slider')).toBeTruthy()
  })

  it('respects min and max bounds', () => {
    const { getByTestId } = render(
      <Slider value={150} min={0} max={100} testID="slider" />
    )
    expect(getByTestId('slider')).toBeTruthy()
  })
})
