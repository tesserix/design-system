import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { Walkthrough } from './Walkthrough'

const mockSteps = [
  {
    title: 'Welcome',
    description: 'Welcome to the app',
  },
  {
    title: 'Features',
    description: 'Explore our features',
  },
  {
    title: 'Get Started',
    description: 'Start using the app',
  },
]

describe('Walkthrough', () => {
  it('renders first step when visible', () => {
    const { getByText } = render(
      <Walkthrough
        steps={mockSteps}
        visible={true}
        onComplete={jest.fn()}
      />
    )
    expect(getByText('Welcome')).toBeTruthy()
    expect(getByText('Welcome to the app')).toBeTruthy()
    expect(getByText('Step 1 of 3')).toBeTruthy()
  })

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <Walkthrough
        steps={mockSteps}
        visible={false}
        onComplete={jest.fn()}
      />
    )
    expect(queryByText('Welcome')).toBeNull()
  })

  it('navigates to next step', () => {
    const { getByText, getByLabelText } = render(
      <Walkthrough
        steps={mockSteps}
        visible={true}
        onComplete={jest.fn()}
      />
    )

    fireEvent.press(getByLabelText('Next step'))
    expect(getByText('Features')).toBeTruthy()
    expect(getByText('Step 2 of 3')).toBeTruthy()
  })

  it('navigates back to previous step', () => {
    const { getByText, getByLabelText } = render(
      <Walkthrough
        steps={mockSteps}
        visible={true}
        onComplete={jest.fn()}
      />
    )

    // Go to second step
    fireEvent.press(getByLabelText('Next step'))
    expect(getByText('Features')).toBeTruthy()

    // Go back
    fireEvent.press(getByText('Back'))
    expect(getByText('Welcome')).toBeTruthy()
  })

  it('calls onComplete when finished', () => {
    const onComplete = jest.fn()
    const { getByLabelText } = render(
      <Walkthrough
        steps={mockSteps}
        visible={true}
        onComplete={onComplete}
      />
    )

    // Navigate to last step
    fireEvent.press(getByLabelText('Next step'))
    fireEvent.press(getByLabelText('Next step'))

    // Complete
    fireEvent.press(getByLabelText('Complete walkthrough'))
    expect(onComplete).toHaveBeenCalled()
  })

  it('calls onSkip when skip is pressed', () => {
    const onSkip = jest.fn()
    const { getByLabelText } = render(
      <Walkthrough
        steps={mockSteps}
        visible={true}
        onComplete={jest.fn()}
        onSkip={onSkip}
      />
    )

    fireEvent.press(getByLabelText('Skip walkthrough'))
    expect(onSkip).toHaveBeenCalled()
  })

  it('renders custom content', () => {
    const stepsWithContent = [
      {
        ...mockSteps[0],
        content: <Text>Custom Content</Text>,
      },
    ]

    const { getByText } = render(
      <Walkthrough
        steps={stepsWithContent}
        visible={true}
        onComplete={jest.fn()}
      />
    )

    expect(getByText('Custom Content')).toBeTruthy()
  })
})
