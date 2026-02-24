import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { AudioPlayer } from './AudioPlayer'

describe('AudioPlayer', () => {
  it('renders audio player', () => {
    const { getByLabelText } = render(
      <AudioPlayer source={{ uri: 'https://example.com/audio.mp3' }} />
    )
    expect(getByLabelText('Play')).toBeTruthy()
  })

  it('renders track info', () => {
    const { getByText } = render(
      <AudioPlayer
        source={{ uri: 'https://example.com/audio.mp3' }}
        title="Song Title"
        artist="Artist Name"
      />
    )
    expect(getByText('Song Title')).toBeTruthy()
    expect(getByText('Artist Name')).toBeTruthy()
  })

  it('toggles play/pause state', () => {
    const { getByLabelText } = render(
      <AudioPlayer source={{ uri: 'https://example.com/audio.mp3' }} />
    )
    const playButton = getByLabelText('Play')
    fireEvent.press(playButton)
    expect(getByLabelText('Pause')).toBeTruthy()
  })

  it('has skip controls', () => {
    const { getByLabelText } = render(
      <AudioPlayer source={{ uri: 'https://example.com/audio.mp3' }} />
    )
    expect(getByLabelText('Skip backward 10 seconds')).toBeTruthy()
    expect(getByLabelText('Skip forward 10 seconds')).toBeTruthy()
  })
})
