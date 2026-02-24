import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders children', () => {
    const { getByText } = render(
      <Tooltip label="Tooltip text">
        <Text>Hover me</Text>
      </Tooltip>
    )
    expect(getByText('Hover me')).toBeTruthy()
  })

  it('shows tooltip on press in', () => {
    const { getByText } = render(
      <Tooltip label="Tooltip text">
        <Text>Hover me</Text>
      </Tooltip>
    )
    fireEvent(getByText('Hover me'), 'pressIn')
    expect(getByText('Tooltip text')).toBeTruthy()
  })
})
