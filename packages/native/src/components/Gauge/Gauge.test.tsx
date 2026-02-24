import React from 'react'
import { render } from '@testing-library/react-native'
import { Gauge } from './Gauge'

describe('Gauge', () => {
  it('renders with value', () => {
    const { getByLabelText } = render(<Gauge value={75} />)
    expect(getByLabelText('Gauge')).toBeTruthy()
  })

  it('displays value text', () => {
    const { getByText } = render(<Gauge value={42} showValue={true} />)
    expect(getByText('42')).toBeTruthy()
  })

  it('displays label when provided', () => {
    const { getByText } = render(
      <Gauge value={50} label="Progress" showValue={true} />
    )
    expect(getByText('Progress')).toBeTruthy()
  })

  it('clamps value within min and max', () => {
    const { getByText } = render(
      <Gauge value={150} min={0} max={100} showValue={true} />
    )
    expect(getByText('100')).toBeTruthy()
  })

  it('handles minimum value', () => {
    const { getByText } = render(
      <Gauge value={-10} min={0} max={100} showValue={true} />
    )
    expect(getByText('0')).toBeTruthy()
  })

  it('does not show value when showValue is false', () => {
    const { queryByText } = render(<Gauge value={50} showValue={false} />)
    expect(queryByText('50')).toBeNull()
  })

  it('supports custom size', () => {
    const { getByLabelText } = render(<Gauge value={50} size={200} />)
    expect(getByLabelText('Gauge')).toBeTruthy()
  })

  it('supports custom colors', () => {
    const { getByLabelText } = render(
      <Gauge
        value={50}
        color="#ff0000"
        backgroundColor="#cccccc"
      />
    )
    expect(getByLabelText('Gauge')).toBeTruthy()
  })

  it('has proper accessibility attributes', () => {
    const { getByLabelText } = render(
      <Gauge value={60} min={0} max={100} label="Speed" />
    )
    const gauge = getByLabelText('Speed')
    expect(gauge).toBeTruthy()
  })
})
