import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { PricingCard } from './PricingCard'

const mockFeatures = [
  { text: 'Feature 1', included: true },
  { text: 'Feature 2', included: true },
  { text: 'Feature 3', included: false },
]

describe('PricingCard', () => {
  it('renders pricing information', () => {
    const { getByText } = render(
      <PricingCard
        name="Pro Plan"
        price={29}
        features={mockFeatures}
      />
    )
    expect(getByText('Pro Plan')).toBeTruthy()
    expect(getByText('29')).toBeTruthy()
    expect(getByText('/month')).toBeTruthy()
  })

  it('displays description when provided', () => {
    const { getByText } = render(
      <PricingCard
        name="Pro Plan"
        description="Best for professionals"
        price={29}
        features={mockFeatures}
      />
    )
    expect(getByText('Best for professionals')).toBeTruthy()
  })

  it('displays badge when provided', () => {
    const { getByText } = render(
      <PricingCard
        name="Pro Plan"
        price={29}
        features={mockFeatures}
        badge="Most Popular"
      />
    )
    expect(getByText('Most Popular')).toBeTruthy()
  })

  it('renders features with correct icons', () => {
    const { getByText } = render(
      <PricingCard
        name="Pro Plan"
        price={29}
        features={mockFeatures}
      />
    )
    expect(getByText('Feature 1')).toBeTruthy()
    expect(getByText('Feature 2')).toBeTruthy()
    expect(getByText('Feature 3')).toBeTruthy()
  })

  it('calls onPress when button is pressed', () => {
    const onPress = jest.fn()
    const { getByLabelText } = render(
      <PricingCard
        name="Pro Plan"
        price={29}
        features={mockFeatures}
        onPress={onPress}
      />
    )
    fireEvent.press(getByLabelText('Get Started'))
    expect(onPress).toHaveBeenCalled()
  })

  it('displays custom button text', () => {
    const { getByText } = render(
      <PricingCard
        name="Pro Plan"
        price={29}
        features={mockFeatures}
        buttonText="Subscribe Now"
        onPress={jest.fn()}
      />
    )
    expect(getByText('Subscribe Now')).toBeTruthy()
  })

  it('supports custom currency and period', () => {
    const { getByText } = render(
      <PricingCard
        name="Pro Plan"
        price={99}
        currency="€"
        period="year"
        features={mockFeatures}
      />
    )
    expect(getByText('€')).toBeTruthy()
    expect(getByText('/year')).toBeTruthy()
  })
})
