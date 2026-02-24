import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Notification } from './Notification'

describe('Notification', () => {
  it('renders title and message', () => {
    const { getByText } = render(
      <Notification
        visible={true}
        title="Success"
        message="Operation completed"
      />
    )
    expect(getByText('Success')).toBeTruthy()
    expect(getByText('Operation completed')).toBeTruthy()
  })

  it('renders different variants', () => {
    const { rerender, getByText } = render(
      <Notification visible={true} title="Info" variant="info" />
    )
    expect(getByText('Info')).toBeTruthy()

    rerender(<Notification visible={true} title="Success" variant="success" />)
    expect(getByText('Success')).toBeTruthy()

    rerender(<Notification visible={true} title="Warning" variant="warning" />)
    expect(getByText('Warning')).toBeTruthy()

    rerender(<Notification visible={true} title="Error" variant="error" />)
    expect(getByText('Error')).toBeTruthy()
  })

  it('calls onDismiss when close button is pressed', () => {
    const onDismiss = jest.fn()
    const { getByLabelText } = render(
      <Notification
        visible={true}
        title="Test"
        onDismiss={onDismiss}
      />
    )
    const closeButton = getByLabelText('Dismiss notification')
    fireEvent.press(closeButton)
    expect(onDismiss).toHaveBeenCalled()
  })

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <Notification visible={false} title="Hidden" />
    )
    expect(queryByText('Hidden')).toBeNull()
  })

  it('hides close button when showClose is false', () => {
    const { queryByLabelText } = render(
      <Notification visible={true} title="Test" showClose={false} />
    )
    expect(queryByLabelText('Dismiss notification')).toBeNull()
  })
})
