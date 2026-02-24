import React from 'react'
import { render } from '@testing-library/react-native'
import { QRCode } from './QRCode'

describe('QRCode', () => {
  it('renders QR code', () => {
    const { getByLabelText } = render(
      <QRCode value="https://example.com" />
    )
    expect(getByLabelText('QR code for https://example.com')).toBeTruthy()
  })

  it('renders with custom size', () => {
    const { getByLabelText } = render(
      <QRCode value="test" size={300} />
    )
    const qrCode = getByLabelText('QR code for test')
    expect(qrCode.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: 300, height: 300 })])
    )
  })

  it('renders with custom colors', () => {
    const { getByLabelText } = render(
      <QRCode
        value="test"
        backgroundColor="#000000"
        color="#ffffff"
      />
    )
    const qrCode = getByLabelText('QR code for test')
    expect(qrCode.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#000000' })])
    )
  })
})
