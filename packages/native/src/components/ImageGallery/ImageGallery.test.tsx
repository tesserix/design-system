import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ImageGallery } from './ImageGallery'

const mockImages = [
  { uri: 'https://example.com/image1.jpg', caption: 'Image 1' },
  { uri: 'https://example.com/image2.jpg', caption: 'Image 2' },
  { uri: 'https://example.com/image3.jpg' },
]

describe('ImageGallery', () => {
  it('renders thumbnails', () => {
    const { getAllByRole } = render(
      <ImageGallery images={mockImages} />
    )
    const thumbnails = getAllByRole('button')
    expect(thumbnails.length).toBe(3)
  })

  it('opens modal on thumbnail press', () => {
    const { getAllByRole, getByText } = render(
      <ImageGallery images={mockImages} />
    )
    const firstThumbnail = getAllByRole('button')[0]
    fireEvent.press(firstThumbnail)
    expect(getByText('1 / 3')).toBeTruthy()
  })

  it('closes modal on close button press', () => {
    const { getAllByRole, getByLabelText, queryByText } = render(
      <ImageGallery images={mockImages} />
    )
    const firstThumbnail = getAllByRole('button')[0]
    fireEvent.press(firstThumbnail)

    const closeButton = getByLabelText('Close gallery')
    fireEvent.press(closeButton)
    expect(queryByText('1 / 3')).toBeNull()
  })

  it('displays image captions', () => {
    const { getAllByRole, getByText } = render(
      <ImageGallery images={mockImages} />
    )
    const firstThumbnail = getAllByRole('button')[0]
    fireEvent.press(firstThumbnail)
    expect(getByText('Image 1')).toBeTruthy()
  })
})
