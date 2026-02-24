import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { VideoPlayer } from './VideoPlayer'

describe('VideoPlayer', () => {
  it('renders video player', () => {
    const { getByText } = render(
      <VideoPlayer source={{ uri: 'https://example.com/video.mp4' }} />
    )
    expect(getByText('🎬 Video')).toBeTruthy()
  })

  it('shows controls when enabled', () => {
    const { getByLabelText } = render(
      <VideoPlayer
        source={{ uri: 'https://example.com/video.mp4' }}
        showControls={true}
      />
    )
    expect(getByLabelText('Play')).toBeTruthy()
    expect(getByLabelText('Mute')).toBeTruthy()
  })

  it('toggles play/pause state', () => {
    const { getByLabelText } = render(
      <VideoPlayer source={{ uri: 'https://example.com/video.mp4' }} />
    )
    const playButton = getByLabelText('Play')
    fireEvent.press(playButton)
    expect(getByLabelText('Pause')).toBeTruthy()
  })

  it('toggles mute state', () => {
    const { getByLabelText } = render(
      <VideoPlayer source={{ uri: 'https://example.com/video.mp4' }} />
    )
    const muteButton = getByLabelText('Mute')
    fireEvent.press(muteButton)
    expect(getByLabelText('Unmute')).toBeTruthy()
  })
})
