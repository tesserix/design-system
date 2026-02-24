import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { ShareButton } from './ShareButton'

describe('ShareButton', () => {
  it('renders share button', () => {
    const { getByText } = render(
      <ShareButton content={{ message: 'Hello' }} />
    )
    expect(getByText('Share')).toBeTruthy()
  })

  it('renders custom label', () => {
    const { getByText } = render(
      <ShareButton content={{ message: 'Hello' }} label="Share this" />
    )
    expect(getByText('Share this')).toBeTruthy()
  })

  it('renders with icon', () => {
    const { getByText } = render(
      <ShareButton
        content={{ message: 'Hello' }}
        icon={<Text>📤</Text>}
      />
    )
    expect(getByText('📤')).toBeTruthy()
  })

  it('calls onShare when pressed', () => {
    const onShare = jest.fn()
    const { getByLabelText } = render(
      <ShareButton content={{ message: 'Hello' }} onShare={onShare} />
    )
    const button = getByLabelText('Share')
    fireEvent.press(button)
    expect(onShare).toHaveBeenCalled()
  })

  it('renders different variants', () => {
    const { getByText } = render(
      <ShareButton content={{ message: 'Hello' }} variant="outline" />
    )
    expect(getByText('Share')).toBeTruthy()
  })
})
