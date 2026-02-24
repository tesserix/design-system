import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Accordion } from './Accordion'

describe('Accordion', () => {
  it('renders title', () => {
    const { getByText } = render(
      <Accordion title="Accordion Title">
        <Text>Content</Text>
      </Accordion>
    )
    expect(getByText('Accordion Title')).toBeTruthy()
  })

  it('expands when pressed', () => {
    const { getByText, queryByText } = render(
      <Accordion title="Title">
        <Text>Content</Text>
      </Accordion>
    )
    expect(queryByText('Content')).toBeNull()
    fireEvent.press(getByText('Title'))
    expect(getByText('Content')).toBeTruthy()
  })

  it('starts expanded when defaultExpanded is true', () => {
    const { getByText } = render(
      <Accordion title="Title" defaultExpanded>
        <Text>Content</Text>
      </Accordion>
    )
    expect(getByText('Content')).toBeTruthy()
  })
})
