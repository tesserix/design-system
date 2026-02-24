import React from 'react'
import { render } from '@testing-library/react-native'
import { ReviewCard } from './ReviewCard'

describe('ReviewCard', () => {
  const defaultProps = {
    rating: 4,
    reviewerName: 'John Doe',
    date: '2024-01-15',
    reviewText: 'Great product! Highly recommended.',
  }

  it('renders correctly', () => {
    const { getByText } = render(<ReviewCard {...defaultProps} />)
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('2024-01-15')).toBeTruthy()
    expect(getByText('Great product! Highly recommended.')).toBeTruthy()
  })

  it('renders correct number of filled stars', () => {
    const { getAllByText } = render(<ReviewCard {...defaultProps} rating={3} maxRating={5} />)
    const stars = getAllByText('★')
    expect(stars).toHaveLength(5)
  })

  it('displays helpful votes when provided', () => {
    const { getByText } = render(<ReviewCard {...defaultProps} helpfulVotes={12} />)
    expect(getByText('12 people found this helpful')).toBeTruthy()
  })

  it('displays singular "person" for 1 helpful vote', () => {
    const { getByText } = render(<ReviewCard {...defaultProps} helpfulVotes={1} />)
    expect(getByText('1 person found this helpful')).toBeTruthy()
  })

  it('does not display helpful votes when zero', () => {
    const { queryByText } = render(<ReviewCard {...defaultProps} helpfulVotes={0} />)
    expect(queryByText(/found this helpful/)).toBeNull()
  })

  it('exposes proper accessibility properties', () => {
    const { getByTestId } = render(<ReviewCard {...defaultProps} testID="review-card" />)
    const card = getByTestId('review-card')
    expect(card.props.accessibilityRole).toBe('text')
    expect(card.props.accessibilityLabel).toContain('John Doe')
    expect(card.props.accessibilityLabel).toContain('4 out of 5 stars')
  })

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' }
    const { getByTestId } = render(
      <ReviewCard {...defaultProps} testID="review-card" style={customStyle} />
    )
    const card = getByTestId('review-card')
    expect(card.props.style).toContainEqual(expect.objectContaining(customStyle))
  })
})
