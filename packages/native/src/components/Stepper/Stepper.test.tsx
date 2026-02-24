import React from 'react'
import { render } from '@testing-library/react-native'
import { Stepper } from './Stepper'

const mockSteps = [
  { label: 'Step 1' },
  { label: 'Step 2' },
  { label: 'Step 3' },
]

describe('Stepper', () => {
  it('renders all steps', () => {
    const { getByText } = render(<Stepper steps={mockSteps} />)
    expect(getByText('Step 1')).toBeTruthy()
    expect(getByText('Step 2')).toBeTruthy()
    expect(getByText('Step 3')).toBeTruthy()
  })

  it('highlights active step', () => {
    const { getByText } = render(<Stepper steps={mockSteps} activeStep={1} />)
    expect(getByText('Step 2')).toBeTruthy()
  })
})
