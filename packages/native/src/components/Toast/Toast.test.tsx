import React from 'react'
import { render } from '@testing-library/react-native'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renders when isVisible is true', () => {
    const { getByText } = render(
      <Toast message="Test message" isVisible={true} />
    )
    expect(getByText('Test message')).toBeTruthy()
  })

  it('does not render when isVisible is false', () => {
    const { queryByText } = render(
      <Toast message="Test message" isVisible={false} />
    )
    expect(queryByText('Test message')).toBeNull()
  })

  it('renders different variants', () => {
    const { rerender, getByText } = render(
      <Toast message="Info" variant="info" isVisible={true} />
    )
    expect(getByText('Info')).toBeTruthy()

    rerender(<Toast message="Success" variant="success" isVisible={true} />)
    expect(getByText('Success')).toBeTruthy()

    rerender(<Toast message="Warning" variant="warning" isVisible={true} />)
    expect(getByText('Warning')).toBeTruthy()

    rerender(<Toast message="Error" variant="error" isVisible={true} />)
    expect(getByText('Error')).toBeTruthy()
  })
})
