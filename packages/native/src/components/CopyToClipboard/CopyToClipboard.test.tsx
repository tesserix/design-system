import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { CopyToClipboard } from './CopyToClipboard'

describe('CopyToClipboard', () => {
  it('renders copy button', () => {
    const { getByText } = render(<CopyToClipboard text="Hello World" />)
    expect(getByText('Copy')).toBeTruthy()
  })

  it('shows copied state when clicked', () => {
    const { getByText } = render(
      <CopyToClipboard text="Hello World" />
    )
    const button = getByText('Copy')
    fireEvent.press(button)
    expect(getByText('Copied!')).toBeTruthy()
  })

  it('renders custom labels', () => {
    const { getByText } = render(
      <CopyToClipboard
        text="Hello"
        label="Copy text"
        copiedLabel="Text copied!"
      />
    )
    expect(getByText('Copy text')).toBeTruthy()
  })

  it('renders children', () => {
    const { getByText } = render(
      <CopyToClipboard text="Hello">
        <Text>Custom Copy Button</Text>
      </CopyToClipboard>
    )
    expect(getByText('Custom Copy Button')).toBeTruthy()
  })
})
