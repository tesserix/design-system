import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Spotlight } from './Spotlight'

const mockTarget = {
  x: 100,
  y: 200,
  width: 150,
  height: 50,
}

describe('Spotlight', () => {
  it('renders when visible', () => {
    const { getByLabelText } = render(
      <Spotlight
        visible={true}
        target={mockTarget}
        onDismiss={jest.fn()}
      />
    )
    expect(getByLabelText('Feature spotlight')).toBeTruthy()
  })

  it('does not render when not visible', () => {
    const { queryByLabelText } = render(
      <Spotlight
        visible={false}
        target={mockTarget}
        onDismiss={jest.fn()}
      />
    )
    expect(queryByLabelText('Feature spotlight')).toBeNull()
  })

  it('renders title and description', () => {
    const { getByText } = render(
      <Spotlight
        visible={true}
        target={mockTarget}
        title="New Feature"
        description="Check out this awesome feature"
        onDismiss={jest.fn()}
      />
    )
    expect(getByText('New Feature')).toBeTruthy()
    expect(getByText('Check out this awesome feature')).toBeTruthy()
  })

  it('calls onDismiss when dismiss button is pressed', () => {
    const onDismiss = jest.fn()
    const { getByLabelText } = render(
      <Spotlight
        visible={true}
        target={mockTarget}
        title="New Feature"
        description="Description"
        onDismiss={onDismiss}
      />
    )

    fireEvent.press(getByLabelText('Dismiss spotlight'))
    expect(onDismiss).toHaveBeenCalled()
  })

  it('calls onDismiss when overlay is pressed', () => {
    const onDismiss = jest.fn()
    const { getByLabelText } = render(
      <Spotlight
        visible={true}
        target={mockTarget}
        onDismiss={onDismiss}
      />
    )

    fireEvent.press(getByLabelText('Feature spotlight').parent!)
    expect(onDismiss).toHaveBeenCalled()
  })

  it('supports different tooltip positions', () => {
    const { rerender, getByText } = render(
      <Spotlight
        visible={true}
        target={mockTarget}
        title="Feature"
        description="Description"
        tooltipPosition="top"
        onDismiss={jest.fn()}
      />
    )
    expect(getByText('Feature')).toBeTruthy()

    rerender(
      <Spotlight
        visible={true}
        target={mockTarget}
        title="Feature"
        description="Description"
        tooltipPosition="bottom"
        onDismiss={jest.fn()}
      />
    )
    expect(getByText('Feature')).toBeTruthy()
  })
})
