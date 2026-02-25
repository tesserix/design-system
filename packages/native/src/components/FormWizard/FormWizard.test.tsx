import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Text } from 'react-native'
import { FormWizard, FormStep } from './FormWizard'

describe('FormWizard', () => {
  const mockSteps: FormStep[] = [
    { id: '1', title: 'Personal Info', component: <Text>Step 1 Content</Text> },
    { id: '2', title: 'Address', component: <Text>Step 2 Content</Text> },
    { id: '3', title: 'Review', component: <Text>Step 3 Content</Text> },
  ]

  it('renders correctly', () => {
    const { getByText } = render(<FormWizard steps={mockSteps} />)
    expect(getByText('Personal Info')).toBeTruthy()
    expect(getByText('Address')).toBeTruthy()
    expect(getByText('Review')).toBeTruthy()
  })

  it('displays first step content initially', () => {
    const { getByText } = render(<FormWizard steps={mockSteps} />)
    expect(getByText('Step 1 Content')).toBeTruthy()
  })

  it('navigates to next step when Next button is pressed', () => {
    const { getByText, queryByText } = render(<FormWizard steps={mockSteps} />)

    expect(getByText('Step 1 Content')).toBeTruthy()

    fireEvent.press(getByText('Next'))

    expect(queryByText('Step 1 Content')).toBeNull()
    expect(getByText('Step 2 Content')).toBeTruthy()
  })

  it('navigates to previous step when Previous button is pressed', () => {
    const { getByText, queryByText } = render(<FormWizard steps={mockSteps} initialStep={1} />)

    expect(getByText('Step 2 Content')).toBeTruthy()

    fireEvent.press(getByText('Previous'))

    expect(queryByText('Step 2 Content')).toBeNull()
    expect(getByText('Step 1 Content')).toBeTruthy()
  })

  it('disables Previous button on first step', () => {
    const { getByLabelText } = render(<FormWizard steps={mockSteps} />)

    const prevButton = getByLabelText('Previous step')
    expect(prevButton.props.accessibilityState.disabled).toBe(true)
  })

  it('changes button text to Complete on last step', () => {
    const { getByText } = render(<FormWizard steps={mockSteps} initialStep={2} />)
    expect(getByText('Complete')).toBeTruthy()
  })

  it('calls onComplete when Complete button is pressed on last step', () => {
    const onComplete = jest.fn()
    const { getByText } = render(
      <FormWizard steps={mockSteps} initialStep={2} onComplete={onComplete} />
    )

    fireEvent.press(getByText('Complete'))
    expect(onComplete).toHaveBeenCalled()
  })

  it('calls onStepChange when navigating between steps', () => {
    const onStepChange = jest.fn()
    const { getByText } = render(<FormWizard steps={mockSteps} onStepChange={onStepChange} />)

    fireEvent.press(getByText('Next'))
    expect(onStepChange).toHaveBeenCalledWith(1)

    fireEvent.press(getByText('Previous'))
    expect(onStepChange).toHaveBeenCalledWith(0)
  })

  it('allows clicking on previous completed steps', () => {
    const { getByText, getByLabelText } = render(
      <FormWizard steps={mockSteps} initialStep={2} />
    )

    expect(getByText('Step 3 Content')).toBeTruthy()

    fireEvent.press(getByLabelText('Step 1: Personal Info'))
    expect(getByText('Step 1 Content')).toBeTruthy()
  })

  it('does not allow clicking on future steps', () => {
    const { getByText, getByLabelText } = render(<FormWizard steps={mockSteps} />)

    expect(getByText('Step 1 Content')).toBeTruthy()

    fireEvent.press(getByLabelText('Step 3: Review'))
    expect(getByText('Step 1 Content')).toBeTruthy() // Should still be on step 1
  })

  it('renders with testID', () => {
    const { getByTestId } = render(<FormWizard steps={mockSteps} testID="form-wizard" />)
    expect(getByTestId('form-wizard')).toBeTruthy()
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <FormWizard steps={mockSteps} testID="form-wizard" style={customStyle} />
    )
    const wizard = getByTestId('form-wizard')
    expect(wizard.props.style).toContainEqual(expect.objectContaining(customStyle))
  })

  it('handles empty steps without crashing', () => {
    const onComplete = jest.fn()
    const { getByText } = render(<FormWizard steps={[]} onComplete={onComplete} />)

    fireEvent.press(getByText('Next'))
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('clamps initialStep when it is larger than available steps', () => {
    const { getByText } = render(<FormWizard steps={mockSteps} initialStep={999} />)
    expect(getByText('Step 3 Content')).toBeTruthy()
  })
})
