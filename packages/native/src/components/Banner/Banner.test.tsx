import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Banner } from './Banner'

describe('Banner', () => {
  it('renders message', () => {
    const { getByText } = render(<Banner message="Test message" />)
    expect(getByText('Test message')).toBeTruthy()
  })

  it('shows close button when closeable', () => {
    const { getByText } = render(<Banner message="Test" closeable onClose={jest.fn()} />)
    expect(getByText('✕')).toBeTruthy()
  })

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn()
    const { getByText } = render(<Banner message="Test" closeable onClose={onClose} />)
    fireEvent.press(getByText('✕'))
    expect(onClose).toHaveBeenCalled()
  })

  it('renders different variants', () => {
    const { rerender, getByText } = render(<Banner message="Info" variant="info" />)
    expect(getByText('Info')).toBeTruthy()

    rerender(<Banner message="Success" variant="success" />)
    expect(getByText('Success')).toBeTruthy()
  })
})
