import React from 'react'
import { render } from '@testing-library/react-native'
import { ProgressSteps } from './ProgressSteps'

const mockSteps = [
  { label: 'Step 1', description: 'First step' },
  { label: 'Step 2', description: 'Second step' },
  { label: 'Step 3', description: 'Third step' },
]

describe('ProgressSteps', () => {
  it('renders all steps', () => {
    const { getByText } = render(
      <ProgressSteps steps={mockSteps} currentStep={0} />
    )
    expect(getByText('Step 1')).toBeTruthy()
    expect(getByText('Step 2')).toBeTruthy()
    expect(getByText('Step 3')).toBeTruthy()
  })

  it('renders step descriptions', () => {
    const { getByText } = render(
      <ProgressSteps steps={mockSteps} currentStep={0} />
    )
    expect(getByText('First step')).toBeTruthy()
    expect(getByText('Second step')).toBeTruthy()
  })

  it('shows checkmark for completed steps', () => {
    const { getAllByText } = render(
      <ProgressSteps steps={mockSteps} currentStep={2} />
    )
    const checkmarks = getAllByText('✓')
    expect(checkmarks.length).toBe(2)
  })

  it('renders in vertical orientation', () => {
    const { getByText } = render(
      <ProgressSteps steps={mockSteps} currentStep={0} orientation="vertical" />
    )
    expect(getByText('Step 1')).toBeTruthy()
  })
})
